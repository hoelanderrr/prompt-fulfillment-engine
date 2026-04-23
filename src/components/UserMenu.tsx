import { LogOut, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const initials = (s: string) =>
  s.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

export const UserMenu = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Link
        to="/auth"
        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:border-primary/50 hover:text-primary-glow transition-all"
      >
        SIGN IN
      </Link>
    );
  }

  const label = (user.user_metadata?.display_name as string) || user.email || "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-2 text-xs font-mono uppercase tracking-wider hover:border-primary/50 transition-all">
          <span className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
            {initials(label)}
          </span>
          <span className="hidden sm:inline max-w-[120px] truncate normal-case">{label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Signed in
        </DropdownMenuLabel>
        <div className="px-2 pb-2 text-sm truncate">{user.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserIcon className="h-4 w-4 mr-2" /> Profile (soon)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            toast.success("Signed out");
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
