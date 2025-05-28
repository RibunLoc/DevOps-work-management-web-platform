import { Task, TaskList } from '@/types/task';
import { Check, Copy, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../ui/select';

interface ShareModalProps {
    item: Task | TaskList;
    itemType: 'task' | 'list';
    onClose: () => void;
    onShare: (item: Task | TaskList, email: string, role: 'viewer' | 'editor' | 'admin') => void;
    onUpdatePermission: (item: Task | TaskList, userId: string, role: 'viewer' | 'editor' | 'admin') => void;
    onRemoveUser: (item: Task | TaskList, userId: string) => void;
}

export function ShareModal({
    item,
    itemType,
    onClose,
    onShare,
    onUpdatePermission,
    onRemoveUser
}: ShareModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
    const [copySuccess, setCopySuccess] = useState(false);

    // Reset copied message after 2 seconds
    useEffect(() => {
        if (copySuccess) {
            const timer = setTimeout(() => setCopySuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copySuccess]);

    const handleShare = () => {
        if (email.trim() && email.includes('@')) {
            onShare(item, email, role);
            setEmail('');
        }
    };

    const copyShareLink = () => {
        // In a real app, generate a proper sharing link with item ID
        const shareLink = `https://octaltask.com/share/${itemType}/${item.id}`;
        navigator.clipboard.writeText(shareLink);
        setCopySuccess(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
            <Card className="w-full max-w-md relative overflow-hidden shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium">Share {itemType}</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Add people
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 h-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Select
                                    value={role}
                                    onValueChange={(value) => setRole(value as 'viewer' | 'editor' | 'admin')}
                                >
                                    <SelectTrigger className="w-[110px] h-10 border-gray-300 dark:border-gray-600">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 mt-1"
                                onClick={handleShare}
                                disabled={!email.trim() || !email.includes('@')}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700"></div>
                            <span className="text-xs font-medium text-gray-500">OR</span>
                            <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-10 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                            onClick={copyShareLink}
                        >
                            {copySuccess ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    <span>Copied link</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    <span>Copy link</span>
                                </>
                            )}
                        </Button>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">People with access</h3>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                                {/* Owner */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 bg-blue-100 border border-blue-200">
                                            <AvatarImage src="/avatar-placeholder.png" alt="Owner" />
                                            <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">O</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">You (Owner)</p>
                                            <p className="text-xs text-gray-500">your.email@example.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shared users */}
                                {item.sharedWith?.map(user => (
                                    <div key={user.id} className="flex items-center justify-between py-2 group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 bg-gray-100 border border-gray-200">
                                                <AvatarImage src={user.photoUrl || '/avatar-placeholder.png'} alt={user.name} />
                                                <AvatarFallback className="bg-gray-100 text-gray-800 font-medium">{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) => {
                                                    onUpdatePermission(item, user.id, value as 'viewer' | 'editor' | 'admin');
                                                }}
                                            >
                                                <SelectTrigger className="h-8 text-xs w-[90px] border-gray-200 dark:border-gray-700">
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                                                onClick={() => onRemoveUser(item, user.id)}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {(!item.sharedWith || item.sharedWith.length === 0) && (
                                    <div className="text-sm text-gray-500 py-2 text-center">
                                        No one has been added yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
