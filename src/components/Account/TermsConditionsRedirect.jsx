'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function TermsConditionsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/term-and-conditions'); }, []);
  return null;
}
