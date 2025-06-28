"use client";

import { useState, useRef, useEffect } from "react";
import type { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { getResumeAdvice } from "@/ai/flows/get-resume-advice";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface ResumeChatbotProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export default function ResumeChatbot({ resumeData, setResumeData }: ResumeChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const suggestionPrompts = [
        "Rewrite my professional summary to be more impactful.",
        "Is my latest work experience descriptive enough?",
        "How can I improve the description for my first project?",
    ];

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSendMessage = async (messageContent?: string) => {
        const question = (messageContent || input).trim();
        if (!question) return;

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await getResumeAdvice({
                resumeJson: JSON.stringify(resumeData, null, 2),
                question: question,
            });
            
            const { advice, update } = result;

            setMessages([...newMessages, { role: "assistant", content: advice }]);

            if (update) {
                setResumeData(prevData => {
                    if (!prevData) return null;

                    const { section, id, field, value } = update;

                    if (section === 'summary') {
                        return { ...prevData, summary: value };
                    }
                    
                    if (section === 'personalInfo' && field in prevData.personalInfo) {
                        const key = field as keyof typeof prevData.personalInfo;
                        return { ...prevData, personalInfo: { ...prevData.personalInfo, [key]: value } };
                    }

                    if (['experience', 'education', 'projects'].includes(section)) {
                        const sectionKey = section as 'experience' | 'education' | 'projects';
                        const list = prevData[sectionKey] as any[];
                        const updatedList = list.map(item =>
                            item.id === id ? { ...item, [field]: value } : item
                        );
                        return { ...prevData, [sectionKey]: updatedList };
                    }
                    
                    console.warn('AI tried to update an unknown section or field:', update);
                    return prevData;
                });

                toast({
                    title: "Resume Updated",
                    description: `I've updated the '${field}' in your ${section} section.`,
                });
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage = "Sorry, I had trouble getting advice. Please try again in a moment.";
            setMessages([...newMessages, { role: "assistant", content: errorMessage }]);
             toast({
                variant: "destructive",
                title: "AI Assistant Error",
                description: "Could not get a response from the assistant.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: "Hello! I'm Flow, your AI career coach. How can I help you with your resume today? You can ask me anything or choose a suggestion below." }
            ]);
        }
    }, [isOpen, messages.length]);


    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            >
                <MessageSquare size={28} />
                <span className="sr-only">Open AI Chatbot</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle>AI Career Coach</SheetTitle>
                        <SheetDescription>
                            Get instant feedback and suggestions to improve your resume. Ask me to make changes for you!
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-grow my-4" ref={scrollAreaRef}>
                        <div className="space-y-4 pr-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                     {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><Sparkles size={16}/></AvatarFallback>
                                        </Avatar>
                                     )}
                                    <div className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Sparkles size={16}/></AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                       <Loader2 className="h-5 w-5 animate-spin"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="mb-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestionPrompts.map(prompt => (
                                <Button key={prompt} variant="outline" size="sm" onClick={() => handleSendMessage(prompt)} disabled={isLoading}>
                                    {prompt}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <SheetFooter>
                        <div className="flex w-full space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me to rewrite something..."
                                disabled={isLoading}
                            />
                            <Button onClick={() => handleSendMessage()} disabled={isLoading}>
                               <Send size={16} />
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
