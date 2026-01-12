"use client";
export default function ThemeToggle() {
  function toggle() {
    document.documentElement.classList.toggle("dark");
  }
  return <button onClick={toggle}>🌓</button>;
}
