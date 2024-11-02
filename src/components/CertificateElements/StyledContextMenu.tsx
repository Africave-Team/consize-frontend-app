import React, { ReactElement } from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

export interface ContextMenuOption {
  label: string
  icon?: ReactElement
  onClick?: () => void
  disabled?: boolean
  rightElement?: React.ReactNode
  danger?: boolean
}

export interface ContextMenuGroup {
  label: string
  options: ContextMenuOption[]
  showLabel?: boolean
}

export interface Props {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  menuGroups: ContextMenuGroup[]
  container?: Element | null | undefined
  modal?: boolean
}

export default function StyledContextMenu ({
  children,
  menuGroups,
  onOpenChange,
  container,
  modal = true
}: Props) {
  return (
    <ContextMenuPrimitive.Root onOpenChange={onOpenChange} modal={modal}>
      <ContextMenuPrimitive.Trigger>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal container={container}>
        <ContextMenuPrimitive.Content
          collisionPadding={8}
          className="bg-white w-[234px] border-border-transparent rounded-lg !p-0 shadow-lg overflow-auto max-h-[var(--radix-context-menu-content-available-height)]"
        >
          {menuGroups.map(
            (group, index) =>
              group.options.length > 0 && (
                <div key={group.label}>
                  <ContextMenuPrimitive.Group className="p-1.5">
                    {group.options.map((option) => (
                      <ContextMenuPrimitive.Item
                        disabled={option.disabled}
                        onClick={option.onClick}
                        key={option.label}
                        className={`bg-transparent flex gap-1 items-center px-2.5 py-1.5 rounded-lg ${option.danger ? "text-alert-error-default" : "text-text-primary"} ${option.disabled ? "opacity-40 cursor-default" : "hover:bg-background-tertiary cursor-pointer"} `}
                      >
                        <div className="w-[20px] font-bold">{option.icon}</div>
                        {option.label}
                        {!!option.rightElement && option.rightElement}
                      </ContextMenuPrimitive.Item>
                    ))}
                  </ContextMenuPrimitive.Group>
                  {index >= 0 && index < menuGroups.length - 1 && (
                    <ContextMenuPrimitive.Separator className="bg-border-transparent m-0 h-[1px]" />
                  )}
                </div>
              )
          )}
          <ContextMenuPrimitive.Group>
            <ContextMenuPrimitive.Item />
          </ContextMenuPrimitive.Group>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  )
}
