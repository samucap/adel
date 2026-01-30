import { Event } from "@/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventListProps {
    events: Event[]
    onSelectEvent: (id: string) => void
}

export function EventList({ events, onSelectEvent }: EventListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((event) => (
                <Card
                    key={event.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                    onClick={() => onSelectEvent(event.id)}
                >
                    <div className="aspect-[2/1] relative bg-muted">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {event.active && (
                            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 border-none text-white">
                                Active
                            </Badge>
                        )}
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base line-clamp-2 leading-tight">
                            {event.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                        <div className="flex justify-between items-center">
                            <span>Volume</span>
                            <span className="font-medium text-foreground">
                                ${event.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
