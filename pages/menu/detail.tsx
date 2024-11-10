import { useState } from "react";
import { Button } from "@nextui-org/button";
import { MessageCircle } from "lucide-react";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import { MenuSearch } from "@/components/menu/menu-search";
import { ChatModal } from "@/components/menu/chat-modal";
import { useMenuData } from "@/hooks/use-menu-data";
import { useChat } from "@/hooks/use-chat";
import DefaultLayout from "@/layouts/default";
import { useLocale } from "@/components/locale-provider";

export default function MenuDetailPage() {
  const { t } = useLocale();
  const { menuItems } = useMenuData();
  const chat = useChat(t("chatWelcomeMessage"));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="pt-8 px-4">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t("menuItems")}
                </h1>
                <MenuSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              <div className="grid gap-4">
                {filteredMenuItems.map((item, index) => (
                  <MenuItemCard
                    key={index}
                    item={item}
                    onAskBot={chat.handleSendMessage}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          isIconOnly
          className="fixed bottom-6 right-6 z-50"
          color="primary"
          radius="full"
          size="lg"
          variant="shadow"
          onClick={() => chat.setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>

        <ChatModal
          inputMessage={chat.inputMessage}
          isOpen={chat.isOpen}
          messages={chat.messages}
          onClose={() => chat.setIsOpen(false)}
          onInputChange={chat.setInputMessage}
          onSend={chat.handleSendMessage}
        />
      </div>
    </DefaultLayout>
  );
}
