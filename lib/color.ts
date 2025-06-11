const color = (alpha: number = 100) => {
  return {
    background: `hsla(0, 0%, 100%, ${alpha / 100})`,
    foreground: `hsla(240, 10%, 3.9%, ${alpha / 100})`,
    card: `hsla(0, 0%, 100%, ${alpha / 100})`,
    "card-foreground": `hsla(240, 10%, 3.9%, ${alpha / 100})`,
    popover: `hsla(0, 0%, 100%, ${alpha / 100})`,
    "popover-foreground": `hsla(240, 10%, 3.9%, ${alpha / 100})`,
    primary: `hsla(122, 91%, 21%, ${alpha / 100})`,
    "primary-foreground": `hsla(0, 0%, 98%, ${alpha / 100})`,
    secondary: `hsla(240, 4.8%, 95.9%, ${alpha / 100})`,
    "secondary-foreground": `hsla(240, 5.9%, 10%, ${alpha / 100})`,
    muted: `hsla(240, 4.8%, 95.9%, ${alpha / 100})`,
    "muted-foreground": `hsla(240, 3.8%, 46.1%, ${alpha / 100})`,
    accent: `hsla(240, 4.8%, 95.9%, ${alpha / 100})`,
    "accent-foreground": `hsla(240, 5.9%, 10%, ${alpha / 100})`,
    destructive: `hsla(0, 84.2%, 60.2%, ${alpha / 100})`,
    "destructive-foreground": `hsla(0, 0%, 98%, ${alpha / 100})`,
    border: `hsla(240, 5.9%, 90%, ${alpha / 100})`,
    input: `hsla(240, 5.9%, 90%, ${alpha / 100})`,
    ring: `hsla(240, 5.9%, 10%, ${alpha / 100})`,
  };
};

export { color };
