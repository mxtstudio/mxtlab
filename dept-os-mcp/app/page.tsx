import { redirect } from 'next/navigation';

// www.mxtlab.online is attached to the separate Next.js service. Keep the
// public website canonical on the apex domain instead of sending visitors
// to the intentionally closed dashboard placeholder.
export default function Home() {
  redirect('https://mxtlab.online/');
}
