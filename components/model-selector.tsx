"use client";

import { startTransition, useMemo, useOptimistic, useState } from "react";

import { saveChatModelAsCookie } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { chatModels, getFreeModels } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

import {
  CheckCircleFillIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LogoOpenAI,
  LogoGoogle,
  LogoAnthropic,
} from "./icons";

const SUPPORTED_PROVIDERS = ["openai", "google", "anthropic"];

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId]
  );

  // Group models by provider
  const modelsByProvider = useMemo(() => {
    const grouped: Record<string, typeof chatModels> = {};

    // Group all models by provider
    chatModels.forEach((model) => {
      if (!grouped[model.provider]) {
        grouped[model.provider] = [];
      }
      grouped[model.provider].push(model);
    });

    return grouped;
  }, []);

  // Get sorted provider names
  const providerNames = useMemo(() => {
    return Object.keys(modelsByProvider).sort();
  }, [modelsByProvider]);

  // Format provider name for display
  const formatProviderName = (provider: string) => {
    return provider
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get provider icon
  const getProviderIcon = (provider: string, size = 16) => {
    switch (provider) {
      case "openai":
        return <LogoOpenAI size={size} />;
      case "google":
        return <LogoGoogle size={size} />;
      case "anthropic":
        return <LogoAnthropic />;
      default:
        return null;
    }
  };

  // Handle model selection
  const handleSelectModel = (id: string) => {
    setOpen(false);
    startTransition(() => {
      setOptimisticModelId(id);
      saveChatModelAsCookie(id);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedChatModel && getProviderIcon(selectedChatModel.provider, 14)}
          <span className="ml-1">{selectedChatModel?.name}</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[300px] max-h-[500px] overflow-y-auto"
      >
        {/* Free models section - always visible at the top */}
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
          Free Models
        </div>

        {getFreeModels().map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => handleSelectModel(model.id)}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={model.id === optimisticModelId}
            disabled={!SUPPORTED_PROVIDERS.includes(model.provider)}
          >
            <div className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-1">
                {getProviderIcon(model.provider, 14)}
                <span className="ml-1">{model.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {model.description}
              </div>
            </div>

            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Premium models section with provider submenus */}
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
          <CreditCardIcon size={12} />
          Premium Models
        </div>

        {providerNames.map((provider) => {
          const providerModels = modelsByProvider[provider].filter(
            (model) => model.isPaid
          );
          if (providerModels.length === 0) return null;

          return (
            <DropdownMenuSub key={provider}>
              <DropdownMenuSubTrigger className="capitalize">
                {getProviderIcon(provider)}
                <span className="ml-1">{formatProviderName(provider)}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[280px]">
                {providerModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onSelect={() => handleSelectModel(model.id)}
                    className="gap-4 group/item flex flex-row justify-between items-center"
                    data-active={model.id === optimisticModelId}
                    disabled={!SUPPORTED_PROVIDERS.includes(provider)}
                  >
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-1">
                        {getProviderIcon(model.provider, 14)}
                        <span className="ml-1">{model.name}</span>
                        <span className="text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded px-1 py-0.5 ml-1">
                          {model.creditsPerMessage} credits
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {model.description}
                      </div>
                    </div>

                    <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                      <CheckCircleFillIcon />
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
