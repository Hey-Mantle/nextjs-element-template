import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ui-modal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
        size?: "small" | "medium" | "large" | "fullscreen";
        open?: boolean;
      };
      "ui-title-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
      };
      "ui-save-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "ui-nav-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
