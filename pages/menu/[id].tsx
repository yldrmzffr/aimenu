import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Tabs, Tab } from "@nextui-org/tabs";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import { MenuSearch } from "@/components/menu/menu-search";
import { useMenuData } from "@/hooks/use-menu-data";
import DefaultLayout from "@/layouts/default";
import { MenuItem } from "@/types";
import { useMenuChat } from "@/hooks/use-chat";
import { useLocale } from "@/components/locale-provider";
import Analyzing from "@/components/analyzing";
import { ChatModal } from "@/components/menu/chat-modal";

interface CategoryGroup {
  [key: string]: MenuItem[];
}

export default function MenuDetailPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { id: menuId } = router.query as { id: string };
  const { menuItems, isLoading: menuIsLoading } = useMenuData(menuId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const chat = useMenuChat(menuId, menuItems);
  const { categories, groupedAndFilteredItems } = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      return {
        categories: [],
        groupedAndFilteredItems: {},
      };
    }

    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const grouped = filtered.reduce<CategoryGroup>((acc, item) => {
      const category = item.category || "Other";

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);

      return acc;
    }, {});

    const uniqueCategories = ["all", ...Object.keys(grouped)];

    return {
      categories: uniqueCategories,
      groupedAndFilteredItems: grouped,
    };
  }, [menuItems, searchQuery]);

  const displayedItems =
    selectedCategory === "all"
      ? Object.values(groupedAndFilteredItems).flat()
      : groupedAndFilteredItems[selectedCategory] || [];

  if (menuIsLoading) {
    return <Analyzing />;
  }

  return (
    <DefaultLayout>
      <div className="max-w-[1200px] mx-auto min-h-screen pb-20">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md z-40 px-4 pt-4 border-b">
          <Button
            className="font-medium mb-4"
            color="primary"
            startContent={<ArrowLeft size={20} />}
            variant="light"
            onClick={() => router.push("/start")}
          >
            {t("backToHome")}
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("menuItems")}
            </h1>
            <MenuSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="w-full overflow-auto">
            <Tabs
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0",
                cursor: "w-full",
                tab: "max-w-fit px-2 h-12",
                tabContent: "group-data-[selected=true]:text-primary",
              }}
              color="primary"
              selectedKey={selectedCategory}
              variant="underlined"
              onSelectionChange={(key) => setSelectedCategory(key as string)}
            >
              {categories.map((category) => (
                <Tab
                  key={category}
                  title={
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">
                        {category === "all" ? t("allItems") : category}
                      </span>
                      <span className="text-small text-default-400">
                        (
                        {category === "all"
                          ? Object.values(groupedAndFilteredItems).flat().length
                          : (groupedAndFilteredItems[category] || []).length}
                        )
                      </span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>
        </header>
        <main className="px-4 py-6">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-default-500">
              <p className="text-xl font-medium">{t("noMenuItems")}</p>
              <p className="text-sm mt-2">{t("tryAgainWithNewImage")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {displayedItems.map((item) => (
                <MenuItemCard
                  key={item.name}
                  item={item}
                  onAskBot={chat.handleSendMessage}
                />
              ))}
            </div>
          )}
        </main>

        <Button
          isIconOnly
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow"
          color="primary"
          radius="full"
          size="lg"
          onClick={() => chat.setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>

        <ChatModal
          inputMessage={chat.inputMessage}
          isLoading={chat.isLoading}
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
