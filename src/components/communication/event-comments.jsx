"use client"

import { useState, useEffect } from "react"
import { Send, User, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth.jsx"
import { format } from "date-fns"
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

const CommentActions = ({ comment, onEdit, onDelete, currentUserId, isOrganizer }) => {
  const [showActions, setShowActions] = useState(false)

  // Only show actions if user is the author or an organizer
  if (!(currentUserId === comment.userId || isOrganizer)) return null

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowActions(!showActions)}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </Button>

      {showActions && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-md border bg-popover p-1 shadow-md z-10">
          {currentUserId === comment.userId && (
            <button
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => {
                onEdit(comment)
                setShowActions(false)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
          )}
          <button
            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
            onClick={() => {
              onDelete(comment.id)
              setShowActions(false)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function EventComments({ eventId, isOrganizer = false }) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      try {
        const commentsRef = collection(db, "comments")
        const commentsQuery = query(commentsRef, where("eventId", "==", eventId), orderBy("timestamp", "desc"))
        const commentsSnapshot = await getDocs(commentsQuery)

        const fetchedComments = []
        commentsSnapshot.forEach((doc) => {
          const commentData = doc.data()
          // Convert Firestore timestamp to JS Date
          const timestamp =
            commentData.timestamp instanceof Timestamp
              ? commentData.timestamp.toDate()
              : new Date(commentData.timestamp)

          fetchedComments.push({
            id: doc.id,
            ...commentData,
            timestamp,
          })
        })

        setComments(fetchedComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchComments()
    }
  }, [eventId, toast])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    try {
      // Add comment to Firestore
      const commentData = {
        eventId,
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        userAvatar: user.photoURL || null,
        content: newComment,
        timestamp: new Date(),
        isOrganizer,
      }

      const docRef = await addDoc(collection(db, "comments"), commentData)
      setComments([{ ...commentData, id: docRef.id }, ...comments])
      setNewComment("")

      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return

    try {
      const commentRef = doc(db, "comments", commentId)
      await updateDoc(commentRef, {
        content: editContent,
        edited: true,
      })

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editContent, edited: true } : comment,
        ),
      )

      setEditingComment(null)
      setEditContent("")

      toast({
        title: "Comment updated",
        description: "Your comment has been updated.",
      })
    } catch (error) {
      console.error("Error updating comment:", error)
      toast({
        title: "Error",
        description: "Failed to update your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "comments", commentId)
      await deleteDoc(commentRef)

      setComments(comments.filter((comment) => comment.id !== commentId))

      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimestamp = (date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Discussion ({comments.length})</h2>

      {user ? (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || "/placeholder.svg?height=40&width=40"} alt={user.displayName} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "G"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add to the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Please{" "}
            <a href="/login" className="text-primary hover:underline">
              sign in
            </a>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading comments...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment.userAvatar || "/placeholder.svg?height=40&width=40"}
                    alt={comment.userName}
                  />
                  <AvatarFallback>{comment.userName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.userName}</span>
                      {comment.isOrganizer && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Organizer</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                        {comment.edited && " (edited)"}
                      </span>

                      {(user?.uid === comment.userId || isOrganizer) && (
                        <CommentActions
                          comment={comment}
                          onEdit={handleEditComment}
                          onDelete={handleDeleteComment}
                          currentUserId={user?.uid}
                          isOrganizer={isOrganizer}
                        />
                      )}
                    </div>
                  </div>

                  {editingComment === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingComment(null)} disabled={loading}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSaveEdit(comment.id)} disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm">{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">No comments yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Be the first to start the discussion!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
