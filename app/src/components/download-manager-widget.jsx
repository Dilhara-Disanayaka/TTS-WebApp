"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Download, X, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { useDownloadManager } from "@/hooks/use-download-manager"

export function DownloadManagerWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { downloads, activeDownloads, hasActiveDownloads, cancelDownload, clearCompleted } =
    useDownloadManager()

  if (!hasActiveDownloads && downloads.length === 0) {
    return null
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "downloading":
      case "pending":
        return <Download className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && hasActiveDownloads && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg relative"
          size="sm"
        >
          <Download className="h-5 w-5" />
          {activeDownloads.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {activeDownloads.length}
            </Badge>
          )}
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads
                </CardTitle>
                <CardDescription>
                  {activeDownloads.length > 0
                    ? `${activeDownloads.length} active downloads`
                    : "Download history"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {downloads.some((d) => d.status === "completed") && (
                  <Button variant="ghost" size="sm" onClick={clearCompleted}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {downloads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No downloads yet
                  </p>
                ) : (
                  downloads.map((download) => (
                    <div key={download.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getStatusIcon(download.status)}
                          <span
                            className="text-sm font-medium truncate"
                            title={download.filename}
                          >
                            {download.filename}
                          </span>
                        </div>
                        {download.status === "downloading" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelDownload(download.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {download.status === "downloading" ||
                      download.status === "pending" ? (
                        <div className="space-y-1">
                          <Progress value={download.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {download.status === "pending"
                                ? "Pending..."
                                : "Downloading..."}
                            </span>
                            <span>{download.progress}%</span>
                          </div>
                        </div>
                      ) : download.status === "error" ? (
                        <p className="text-xs text-red-500">{download.error}</p>
                      ) : (
                        <p className="text-xs text-green-600">Download completed</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
