"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDateFormat } from "l-hooks";
import { Icon } from "@/components/ui";
import time_line from "@iconify/icons-mingcute/time-line";
import user_visible_line from "@iconify/icons-mingcute/user-visible-line";

const ViewsCount: React.FC<{ count: number; time: any; from: string }> = ({
  count,
  time,
  from,
}) => {
  const t = useTranslations("share");
  const { format } = useDateFormat();

  return (
    <div className="flex flex-col gap-2">
      {!!from && (
        <div>
          {t("from")} {from}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <Icon icon={time_line} size={18} />
          <span>{format(time, "YYYY-MM-DD")}</span>
        </div>
        <span>|</span>
        <div className="flex gap-1">
          <Icon icon={user_visible_line} size={18} />
          {t("page-views")}：{count}
        </div>
      </div>
    </div>
  );
};

export default ViewsCount;
