import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  /** Sequence of strings to type one after another. */
  words: string[];
  /** ms per character while typing. */
  typeSpeed?: number;
  /** ms per character while deleting. */
  deleteSpeed?: number;
  /** Pause once a word is fully typed. */
  pauseAfterType?: number;
  /** Pause once a word is fully deleted. */
  pauseAfterDelete?: number;
  /** When false, types only the first word and stops (no loop, no delete). */
  loop?: boolean;
  className?: string;
  caretClassName?: string;
}

/**
 * Antigravity-style typewriter: types text character-by-character with a
 * blinking gradient caret. When `loop` is true, cycles through `words`.
 */
export const Typewriter = ({
  words,
  typeSpeed = 55,
  deleteSpeed = 30,
  pauseAfterType = 1600,
  pauseAfterDelete = 400,
  loop = true,
  className,
  caretClassName,
}: TypewriterProps) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const current = words[index] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        if (!loop) return;
        timeout = setTimeout(() => setPhase("deleting"), pauseAfterType);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        }, pauseAfterDelete);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, index, words, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete, loop]);

  return (
    <span className={cn("inline", className)}>
      {text}
      <span
        aria-hidden
        className={cn(
          "inline-block w-[0.08em] -mb-[0.1em] ml-[0.05em] h-[0.95em] align-middle",
          "bg-gradient-to-b from-primary via-primary-glow to-accent",
          "animate-[caret-blink_1s_steps(2)_infinite] rounded-[1px]",
          caretClassName,
        )}
        style={{ boxShadow: "0 0 14px hsl(var(--primary) / 0.7)" }}
      />
    </span>
  );
};
