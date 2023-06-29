import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import {
  useChannel,
  useLLM,
  usePromptOpen,
  usePromptRecent,
  useModel,
  BASE_PROMPT,
  type ChannelIcon,
  type IPrompt,
} from "@/hooks";
import { Button, Divider, Modal, Select, Icon } from "@/components/ui";
import refresh_3_line from "@iconify/icons-mingcute/refresh-3-line";
import translate_line from "@iconify/icons-mingcute/translate-line";
import MenuIcon from "@/components/menu/icon";
import PremiumBtn from "./premiumBtn";

const renderLabel = (item: any) => {
  return (
    <div className="flex gap-2 items-center">
      {item.ico}
      {item.label}
    </div>
  );
};

const renderModelLabel = (item: any) => {
  return (
    <div className="flex gap-4 items-center">
      <span>{item.label}</span>
      {!!item.premium && (
        <span
          className={cn(
            "select-none rounded text-xs py-0.5 px-2 border",
            "border-amber-400 text-amber-400 bg-amber-50",
            "dark:border-orange-500 dark:text-orange-500 dark:bg-orange-50/90"
          )}
        >
          PREMIUM
        </span>
      )}
    </div>
  );
};

const Configure = React.memo(() => {
  const [channel, setChannel] = useChannel();
  const [recentPrompt, setRecentPrompt] = usePromptRecent();
  const { updateType, updateName } = useModel();
  const [, setOpen] = usePromptOpen();
  const { openai, azure } = useLLM();
  const [isShow, setIsShow] = React.useState(true);

  // modal data
  const [open, setOpenModal] = React.useState(false);
  const [lanType, setLanType] = React.useState<"cn" | "en">("cn");
  const [info, setInfo] = React.useState<IPrompt>();

  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const { findChannel, options } = React.useMemo(() => {
    const { list, activeId } = channel;
    const findChannel = list.find((item) => item.channel_id === activeId);
    const options =
      LLMOptions.find((item) => item.value === findChannel?.channel_model.type)
        ?.models || [];

    return { findChannel, options };
  }, [channel]);

  const t = useTranslations("prompt");

  const onChangeType = (value: string) => {
    updateType(value);
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_model.type = value;
      findCh.channel_model.name =
        LLMOptions.find((val) => val.value === value)?.models[0].value || "";
      updateName(findCh.channel_model.name);
      return channel;
    });
  };

  const onChangeModel = (value: string) => {
    updateName(value);
    setChannel((channel) => {
      const { list, activeId } = channel;
      const nowChannel = list.find((item) => item.channel_id === activeId);
      if (!nowChannel) return channel;
      nowChannel.channel_model.name = value;
      return channel;
    });
  };

  const onOpenPrompt = () => setOpen(true);

  const onResetPrompt = (e: any) => {
    e.stopPropagation();
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_icon = "RiChatSmile2Line";
      findCh.channel_name = info?.title || "";
      findCh.channel_prompt = BASE_PROMPT;
      return channel;
    });
  };

  const onClose = () => setOpenModal(false);

  const onToggleLan = () => setLanType(lanType === "cn" ? "en" : "cn");

  const onUse = (data: IPrompt) => {
    setInfo(data);
    if ((data.content as any)?.cn) {
      setLanType("cn");
    } else {
      setLanType("en");
    }
    setOpenModal(true);
  };

  const onOk = () => {
    if (!info) return;
    const prompt = (info?.content as any)?.[lanType] || "";

    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_icon = (info?.icon as ChannelIcon) || "RiChatSmile2Line";
      findCh.channel_name = info?.title || "";
      findCh.channel_prompt = prompt;
      return channel;
    });

    setRecentPrompt((prompt) => {
      const findIndex = prompt.list.findIndex((item) => item.id === info.id);
      if (findIndex !== -1) {
        if (findIndex) {
          const [item] = prompt.list.splice(findIndex, 1);
          prompt.list.unshift(item);
        }
        return prompt;
      }

      return prompt;
    });

    setOpenModal(false);
  };

  React.useEffect(() => {
    setIsShow(false);
    setTimeout(() => {
      setIsShow(true);
    }, 100);
  }, [channel.activeId]);

  return (
    <>
      <div className="flex flex-col h-full w-full pt-16 pb-24 top-0 left-0 gap-1 absolute">
        {isShow && (
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: -300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              y: {
                type: "spring",
                damping: 15,
                stiffness: 200,
              },
            }}
          >
            <div
              className={cn(
                "w-[32.5rem] max-w-[calc(100vw-2rem)] transition-colors",
                "border rounded-md p-3.5 bg-white/90 dark:bg-gray-900/50",
                "border-neutral-200/70 dark:border-white/20"
              )}
            >
              <div>
                <Select
                  className="w-full"
                  size="large"
                  options={LLMOptions}
                  renderLabel={renderLabel}
                  value={findChannel?.channel_model.type}
                  onChange={onChangeType}
                />
                <div className="flex mt-4 gap-4 items-center">
                  <div className="text-sm text-black/90 dark:text-white/90">
                    {t("model")}
                  </div>
                  <div className="flex-1">
                    <Select
                      className="w-full"
                      options={options}
                      renderLabel={renderModelLabel}
                      value={findChannel?.channel_model.name}
                      onChange={onChangeModel}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "w-[32.5rem] max-w-[calc(100vw-2rem)] relative cursor-pointer rounded-xl mt-2 py-3 px-5 transition-all",
                "border shadow-[0_2px_4px_rgba(0,0,0,.04)] select-none",
                "border-[rgba(0,0,0,.08)] dark:border-[rgba(255,255,255,.3)]",
                "bg-white/90 hover:bg-neutral-100 dark:bg-gray-900/50 dark:hover:bg-gray-800",
                "active:bg-[rgb(239,239,239)]"
              )}
              onClick={onOpenPrompt}
            >
              <div className="flex flex-col gap-1">
                <div className="flex text-orange-400 gap-2 items-center justify-center">
                  {findChannel?.channel_icon && (
                    <MenuIcon
                      className="nothing"
                      name={findChannel.channel_icon}
                    />
                  )}
                  Prompt
                </div>
                <div className="text-sm text-neutral-800 line-clamp-6 dark:text-neutral-100 hover:max-h-[calc(50vh)] hover:line-clamp-none hover:overflow-y-auto">
                  {findChannel?.channel_prompt}
                </div>
              </div>
              <Icon
                icon={refresh_3_line}
                size={20}
                className="top-3 right-3 text-sky-400 absolute"
                onClick={onResetPrompt}
              />
            </div>
          </motion.div>
        )}

        {!!isShow && (
          <motion.div
            className="flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PremiumBtn />
            {!!recentPrompt.length && (
              <div className="max-w-[calc(100vw-2rem)] w-80">
                <Divider>
                  <span className="text-sm">{t("recently-used")}</span>
                </Divider>
              </div>
            )}
          </motion.div>
        )}

        {isShow && (
          <motion.div
            className="flex px-6 justify-center"
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              y: {
                type: "spring",
                damping: 20,
                stiffness: 200,
              },
            }}
          >
            <div className="max-w-[calc(100vw-2rem)] grid w-[50rem] gap-3 grid-cols-2 lg:grid-cols-3">
              {recentPrompt.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "group border select-none rounded-lg text-sm py-3 px-4 cursor-pointer flex gap-2 items-center transition-colors",
                    "bg-white/90 hover:bg-neutral-50 dark:bg-gray-900/50 dark:hover:bg-gray-800",
                    "border-[rgba(0,0,0,.08)] dark:border-[rgba(255,255,255,.3)] hover:border-sky-400 dark:hover:border-sky-400",
                    "text-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-100",
                    "active:bg-[rgb(239,239,239)] dark:active:bg-gray-700"
                  )}
                  onClick={() => onUse(item)}
                >
                  <div
                    className={cn(
                      "border p-2 rounded-lg flex transition-colors",
                      "border-[rgba(0,0,0,.08)] dark:border-[rgba(255,255,255,.3)]",
                      "group-hover:bg-sky-100 group-hover:border-sky-100",
                      "dark:group-hover:bg-sky-700 dark:group-hover:border-sky-700"
                    )}
                  >
                    <MenuIcon
                      className="nothing"
                      name={item.icon as ChannelIcon}
                    />
                  </div>
                  <div className="truncate">{item.title}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Modal
        title={t("confirm-use")}
        maskClosable={false}
        open={open}
        onClose={onClose}
        onOk={onOk}
      >
        <Divider />
        <div className="relative">
          <div className="h-60 pt-4 text-[15px] overflow-y-auto">
            {(info?.content as any)?.[lanType]}
          </div>
          {(info?.content as any)?.cn && (info?.content as any)?.en && (
            <Button
              type="primary"
              size="xs"
              className="top-[-0.5rem] right-0 absolute"
              onClick={onToggleLan}
            >
              <Icon icon={translate_line} size={18} />
            </Button>
          )}
        </div>
        <Divider />
      </Modal>
    </>
  );
});

Configure.displayName = "Configure";

export default Configure;
