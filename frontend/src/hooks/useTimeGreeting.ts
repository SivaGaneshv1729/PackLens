import { useEffect, useState } from "react";

export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 19) return "Good Evening";
  return "Good Night";
}

export function useTimeGreeting(): string {
  const [greeting, setGreeting] = useState(() => getTimeGreeting());

  useEffect(() => {
    const updateGreeting = () => setGreeting(getTimeGreeting());
    const now = new Date();
    const millisecondsUntilNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      updateGreeting();
      intervalId = window.setInterval(updateGreeting, 60_000);
    }, millisecondsUntilNextMinute);

    document.addEventListener("visibilitychange", updateGreeting);
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateGreeting);
    };
  }, []);

  return greeting;
}