import { TaskList } from '@/types/task';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { EditListForm } from './EditListForm';

interface EditListModalProps {
    list: TaskList;
    onClose: () => void;
    onUpdateList: (listId: string, name: string, color: string, icon: string) => void;
}

export function EditListModal({ list, onClose, onUpdateList }: EditListModalProps) {
    const handleSubmit = (name: string, color: string, icon: string) => {
        onUpdateList(list.id, name, color, icon);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <Card className="w-full max-w-md relative overflow-hidden shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-2 top-2"
                >
                    <X className="h-4 w-4" />
                </Button>

                <EditListForm
                    list={list}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </Card>
        </div>
    );
}
