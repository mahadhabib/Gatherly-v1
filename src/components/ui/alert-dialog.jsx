"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Simple implementation using the Dialog component we already have
const AlertDialog = Dialog

const AlertDialogTrigger = Dialog.Trigger

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <DialogContent ref={ref} className={cn("sm:max-w-[425px]", className)} {...props} />
))
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = DialogHeader
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = DialogFooter
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = DialogTitle
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = DialogDescription
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} className={cn(className)} {...props} />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} variant="outline" className={cn("mt-2 sm:mt-0", className)} {...props} />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
