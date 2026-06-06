'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Redirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/privacy-policy'); }, []);
  return null;
}
