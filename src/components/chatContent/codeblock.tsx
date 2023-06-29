"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useClipboard } from "l-hooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Icon } from "@/components/ui";
import check_line from "@iconify/icons-mingcute/check-line";
import copy_2_line from "@iconify/icons-mingcute/copy-2-line";

interface Props {
  language: string;
  value: string;
}

const CodeBlock: React.FC<Props> = React.memo(({ language, value }) => {
  const t = useTranslations("chat");
  const { isCopied, copy } = useClipboard();

  const copyToClipboard = () => {
    if (isCopied) return;
    copy(value);
  };

  return (
    <div className="font-sans text-base codeblock relative">
      <div className="flex items-center justify-between py-1.5 px-4">
        <div className="text-sm lowercase text-white">{language}</div>
        <div className="flex items-center">
          <button
            className="flex gap-0.5 items-center rounded bg-none p-1 text-xs text-white"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <>
                <Icon
                  icon={check_line}
                  className="text-[#52c41a] mr-1"
                  size={18}
                />
                {t("copied")}!
              </>
            ) : (
              <>
                <Icon icon={copy_2_line} className="mr-1" size={18} />{" "}
                {t("copy-code")}
              </>
            )}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
