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
        onClose?: () => void;
      };
      "ui-title-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
        subtitle?: string;
        backAction?: (() => void) | string;
      };
      "ui-save-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        visible?: boolean;
        message?: string;
      };
      "ui-nav-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
