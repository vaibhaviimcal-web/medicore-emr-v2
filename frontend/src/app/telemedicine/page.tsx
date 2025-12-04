'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react'

export default function TelemedicinePage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isCallActive) {
      startVideoCall()
    }
  }, [isCallActive])

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn
      })
    }
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn
      })
    }
  }

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCallActive(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Video Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Video Area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Remote Video */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isCallActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400">Waiting for patient to join...</p>
                    </div>
                  )}
                </div>

                {/* Local Video */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video max-w-xs">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    variant={isVideoOn ? 'default' : 'destructive'}
                    onClick={toggleVideo}
                    className="rounded-full w-14 h-14"
                  >
                    {isVideoOn ? <Video /> : <VideoOff />}
                  </Button>
                  <Button
                    size="lg"
                    variant={isAudioOn ? 'default' : 'destructive'}
                    onClick={toggleAudio}
                    className="rounded-full w-14 h-14"
                  >
                    {isAudioOn ? <Mic /> : <MicOff />}
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={endCall}
                    className="rounded-full w-14 h-14"
                  >
                    <PhoneOff />
                  </Button>
                </div>

                {!isCallActive && (
                  <Button
                    onClick={() => setIsCallActive(true)}
                    className="w-full"
                    size="lg"
                  >
                    Start Consultation
                  </Button>
                )}
              </div>

              {/* Patient Info & Notes */}
              <div className="space-y-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 space-y-2">
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Age:</strong> 45 years</p>
                    <p><strong>Blood Group:</strong> O+</p>
                    <p><strong>Allergies:</strong> Penicillin</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Consultation Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full h-40 p-3 bg-gray-800 text-white rounded-md border border-gray-600"
                      placeholder="Enter consultation notes..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
