import { NextResponse } from "next/server";
import { generateText } from "ai";
import PDFParser from "pdf2json";

import { openrouter } from "@/lib/openrouter";

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

    const { text } =
      await generateText({
        model: openrouter(
          "google/gemma-3-27b-it"
        ),

        prompt: `
You are a medical assistant.

Analyze this medical report.

Return ONLY:

Key Findings
Abnormal Results
Potential Risks
Recommendations

Report Name:
${reportName}

Report Content:
${reportContent}
`,
      });

    return NextResponse.json({
      success: true,
      analysis: text,
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