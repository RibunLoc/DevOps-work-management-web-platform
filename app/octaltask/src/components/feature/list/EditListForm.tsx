import { TaskList } from '@/types/task';
import { BookOpen, Briefcase, CheckCircle2, Folder, Home } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'black';
type ListIcon = 'personal' | 'work' | 'home' | 'study' | 'default';

interface EditListFormProps {
    list: TaskList;
    onSubmit: (name: string, color: string, icon: string) => void;
    onCancel: () => void;
}

export function EditListForm({ list, onSubmit, onCancel }: EditListFormProps) {
    const [name, setName] = useState(list.name || '');
    const [selectedColor, setSelectedColor] = useState<ListColor>(list.color as ListColor || 'blue');
    const [selectedIcon, setSelectedIcon] = useState<ListIcon>(list.icon as ListIcon || 'default');

    const colors: { value: ListColor; class: string; iconClass: string }[] = [
      { value: 'blue', class: 'bg-blue-500', iconClass: 'text-blue-500' },
      { value: 'green', class: 'bg-green-500', iconClass: 'text-green-500' },
      { value: 'red', class: 'bg-red-500', iconClass: 'text-red-500' },
      { value: 'purple', class: 'bg-purple-500', iconClass: 'text-purple-500' },
      { value: 'amber', class: 'bg-amber-500', iconClass: 'text-amber-500' },
      { value: 'black', class: 'bg-black', iconClass: 'text-black' },
    ];

    const icons: { value: ListIcon; icon: ReactNode }[] = [
        { value: 'default', icon: <Folder className="h-5 w-5" /> },
        { value: 'personal', icon: <CheckCircle2 className="h-5 w-5" /> },
        { value: 'work', icon: <Briefcase className="h-5 w-5" /> },
        { value: 'home', icon: <Home className="h-5 w-5" /> },
        { value: 'study', icon: <BookOpen className="h-5 w-5" /> },
    ];

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim(), selectedColor, selectedIcon);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-medium text-lg">Edit List</h3>

            <div>
                <label className="text-sm font-medium mb-1 block">List Name</label>
                <Input
                    placeholder="Enter list name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2"
                    autoFocus
                />
            </div>

            <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-2 mb-4">
                    {colors.map((color) => (
                        <div
                            key={color.value}
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => setSelectedColor(color.value)}
                        >
                            <div
                                className={`w-full h-full rounded-full flex items-center justify-center ${color.class}
                                    ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-80 hover:opacity-100'}`}
                            >
                                {selectedColor === color.value && (
                                    <CheckCircle2 className="h-5 w-5 text-white pointer-events-none" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-2 block">Icon</label>
                <div className="flex gap-2 mb-4">
                    {icons.map((iconObj) => {
                        const colorClass = colors.find(c => c.value === selectedColor)?.iconClass || '';
                        return (
                          <div
                            key={iconObj.value}
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => setSelectedIcon(iconObj.value)}
                          >
                            <div
                              className={`w-full h-full rounded-md flex items-center justify-center border transition-all
                                        ${
                                          selectedIcon === iconObj.value
                                            ? `border-2 ${
                                                selectedColor === 'black'
                                                  ? 'border-black'
                                                  : selectedColor === 'blue'
                                                  ? 'border-blue-500'
                                                  : selectedColor === 'green'
                                                  ? 'border-green-500'
                                                  : selectedColor === 'red'
                                                  ? 'border-red-500'
                                                  : selectedColor === 'purple'
                                                  ? 'border-purple-500'
                                                  : 'border-amber-500'
                                              } ${colorClass}`
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                            >
                              {iconObj.icon}
                            </div>
                          </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    className={`bg-blue-500 hover:bg-blue-600 text-white`}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
