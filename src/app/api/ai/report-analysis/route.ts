import { NextResponse } from "next/server";

import PDFParser from "pdf2json";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const reportName =
      formData.get(
        "reportName"
      ) as string;

    let reportContent =
      (formData.get(
        "reportContent"
      ) as string) || "";

    const file =
      formData.get(
        "file"
      ) as File | null;

    // PDF Upload
    if (
      file &&
      file.type ===
        "application/pdf"
    ) {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      console.log(
        "Buffer Length:",
        buffer.length
      );

      const pdfParser =
        new PDFParser();

      reportContent =
        await new Promise<string>(
          (
            resolve,
            reject
          ) => {
            pdfParser.on(
              "pdfParser_dataError",
              (
                error: any
              ) => {
                console.error(
                  "PDF Error:",
                  error
                );

                reject(error);
              }
            );

            pdfParser.on(
              "pdfParser_dataReady",
              (
                pdfData: any
              ) => {
                try {
                  console.log(
                    "PDF Parsed Successfully"
                  );

                  console.log(
                    "Pages Found:",
                    pdfData.Pages
                      ?.length
                  );

                  if (
                    pdfData.Pages?.[0]
                      ?.Texts?.[0]
                  ) {
                    console.log(
                      "Sample Text Object:",
                      JSON.stringify(
                        pdfData
                          .Pages[0]
                          .Texts[0],
                        null,
                        2
                      )
                    );
                  }

                  let extractedText =
                    "";

                  pdfData.Pages?.forEach(
                    (
                      page: any,
                      pageIndex: number
                    ) => {
                      console.log(
                        `Page ${
                          pageIndex +
                          1
                        } Text Count:`,
                        page.Texts
                          ?.length
                      );

                      page.Texts?.forEach(
                        (
                          text: any
                        ) => {
                          text.R?.forEach(
                            (
                              run: any
                            ) => {
                              const value =
                                run.T ||
                                "";

                              try {
                                extractedText +=
                                  decodeURIComponent(
                                    value
                                  ) +
                                  " ";
                              } catch {
                                extractedText +=
                                  value +
                                  " ";
                              }
                            }
                          );

                          extractedText +=
                            "\n";
                        }
                      );
                    }
                  );

                  console.log(
                    "Extracted Length:",
                    extractedText.length
                  );

                  console.log(
                    "First 1000 chars:"
                  );

                  console.log(
                    extractedText.slice(
                      0,
                      1000
                    )
                  );

                  resolve(
                    extractedText
                  );
                } catch (
                  error
                ) {
                  reject(error);
                }
              }
            );

            pdfParser.parseBuffer(
              buffer
            );
          }
        );
    }

    console.log(
      "Final Content Length:",
      reportContent.length
    );

    // No content and no file
    if (
      !reportContent.trim() &&
      !file
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide report content or upload a report file",
        },
        {
          status: 400,
        }
      );
    }

    // PDF uploaded but extraction failed
    if (
      file &&
      !reportContent.trim()
    ) {
      reportContent = `
Uploaded PDF Report

File Name: ${file.name}

Unable to extract text from PDF.
The file may be scanned or image-based.
`;
    }

    const response =
  await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",

    temperature: 0.1,

    max_tokens: 1200,

    messages: [
      {
        role: "system",
        content: `
You are an expert AI Medical Report Analyzer.

Analyze medical reports and laboratory reports.

Return CLEAN MARKDOWN ONLY.

IMPORTANT:
- Do NOT use tables.
- Do NOT use HTML.
- Do NOT use code blocks.
- Use headings and bullet points only.
- Keep explanations simple for patients.
- Highlight abnormal values using ⚠️.
- Mention normal findings when relevant.
- Never provide a diagnosis.
- Never prescribe medication.
- Recommend consulting a healthcare professional when appropriate.

Return EXACTLY in this structure:

# Medical Report Summary

## Key Findings

- Finding 1
- Finding 2

## Abnormal Results

- ⚠️ Test Name: Value (Normal Range)

## Potential Risks

- Risk 1
- Risk 2

## Simplified Explanation

- Point 1
- Point 2
- Point 3

## Recommendations

- Recommendation 1
- Recommendation 2
- Recommendation 3

Formatting Rules:
- Use short bullet points.
- Avoid long paragraphs.
- Avoid medical jargon where possible.
- Maximum 500 words.
        `,
      },
      {
        role: "user",
        content: `
Report Name:
${reportName}

Report Content:
${reportContent}
        `,
      },
    ],
  });

const analysis =
  response.choices?.[0]?.message?.content ||
  "Unable to analyze report.";



   return NextResponse.json({
  success: true,
  analysis,
});
  } catch (error) {
    console.error(
      "Report Analysis Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to analyze report",
      },
      {
        status: 500,
      }
    );
  }
}