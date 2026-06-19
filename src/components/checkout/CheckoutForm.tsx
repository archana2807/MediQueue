"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Smartphone, Building2, Wallet, CheckCircle2,
  Tag, ShoppingCart, ArrowRight, Shield, Lock, BookOpen, Sparkles, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useCheckout } from "@/hooks/use-checkout";
import Image from "next/image";
import Link from "next/link";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, etc." },
  { id: "credit-card", label: "Credit Card", icon: CreditCard, description: "Visa, Mastercard, etc." },
  { id: "debit-card", label: "Debit Card", icon: CreditCard, description: "All banks accepted" },
  { id: "net-banking", label: "Net Banking", icon: Building2, description: "All major banks" },
  { id: "wallet", label: "Wallet", icon: Wallet, description: "Paytm, Amazon Pay, etc." },
];

export default function CheckoutForm() {
  const { items, total, clearCart, removeItem } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const checkoutMutation = useCheckout();

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === "EXAMVERSE10") { setDiscount(total * 0.1); setCouponApplied(true); setCouponError(""); }
    else if (code === "STUDENT20") { setDiscount(total * 0.2); setCouponApplied(true); setCouponError(""); }
    else if (code === "FIRST50") { setDiscount(Math.min(total * 0.5, 200)); setCouponApplied(true); setCouponError(""); }
    else { setDiscount(0); setCouponApplied(false); setCouponError("Invalid coupon code"); }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkoutMutation.mutateAsync({
        items: items.map((item) => ({ bookId: item.bookId, title: item.title, price: item.price, coverImage: item.coverImage, quantity: item.quantity })),
        couponCode: couponApplied ? couponCode : undefined,
        paymentMethod: selectedPayment,
      });
      setOrderId(result.orderId);
      setShowSuccess(true);
      clearCart();
    } catch { console.error("Checkout failed"); }
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="text-center py-20 sm:py-28">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <ShoppingCart className="h-9 w-9 text-muted-foreground" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl font-bold">
          Your cart is empty
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Looks like you haven&apos;t added any books yet. Browse our collection and find the perfect book.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button asChild className="mt-8 rounded-xl" size="lg">
            <Link href="/books">Browse Books <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 sm:py-28">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 dark:bg-green-900/20 shadow-lg">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Purchase Successful!</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your e-books have been added to your library. Start reading immediately.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl shadow-hero">
              <Link href="/library"><BookOpen className="mr-2 h-4 w-4" /> Go to My Library</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-xl">
              <Link href="/books">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const subtotal = total;
  const finalTotal = subtotal - discount;

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        {/* Order Summary */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50 bg-muted/30">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Order Summary ({items.length} items)
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {items.map((item, index) => (
              <motion.div
                key={item.bookId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 px-5 py-3.5 group"
              >
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.bookId)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50 bg-muted/30">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Method
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border/60 p-3.5 text-left transition-all duration-200",
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "hover:border-primary/20 hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                    selectedPayment === method.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <method.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{method.label}</p>
                    <p className="text-[11px] text-muted-foreground">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Price + Coupon */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50 bg-muted/30">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Price Details
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <AnimatePresence>
              {couponApplied && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Coupon Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50 bg-muted/30">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Coupon Code
            </h3>
          </div>
          <div className="p-5">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                disabled={couponApplied}
                className={cn("flex-1 rounded-xl h-10", couponError && "border-destructive focus-visible:ring-destructive")}
              />
              <Button
                variant={couponApplied ? "default" : "outline"}
                onClick={applyCoupon}
                disabled={couponApplied || !couponCode}
                className={cn("rounded-xl h-10", couponApplied && "bg-green-600 hover:bg-green-600 text-white")}
              >
                {couponApplied ? <><CheckCircle2 className="mr-1 h-4 w-4" /> Applied</> : "Apply"}
              </Button>
            </div>
            <AnimatePresence>
              {couponError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 text-xs text-destructive">
                  {couponError}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-4 rounded-xl bg-muted/40 p-3.5 border border-border/40">
              <p className="text-[11px] font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Available Coupons</p>
              <div className="flex flex-wrap gap-1.5">
                {["EXAMVERSE10", "STUDENT20", "FIRST50"].map((code) => (
                  <button key={code} onClick={() => setCouponCode(code)}
                    className="rounded-lg border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-sm font-semibold rounded-xl shadow-hero"
          onClick={handleCheckout}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : <>Pay {formatPrice(finalTotal)} <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>

        <div className="flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
