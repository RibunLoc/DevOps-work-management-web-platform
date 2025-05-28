import { useTask } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskList } from '@/types/task';
import {
    BookOpen,
    Briefcase,
    Calendar,
    CheckCircle2,
    Edit,
    Folder,
    Home,
    MoreHorizontal,
    PlusCircle,
    Share2,
    Trash2,
    Star
} from 'lucide-react';
import { useState } from 'react';
import { CreateListModal } from '../feature/list/CreateListModal';
import { EditListModal } from '../feature/list/EditListModal';
import { ShareListModal } from '../feature/list/ShareListModal';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber';
type ListIcon = 'personal' | 'work' | 'home' | 'study' | 'default';

interface TaskListSidebarProps {
    lists: TaskList[];
    activeListId: string | null;
    onSelectList: (listId: string | null) => void;
    onCreateList?: (name: string, color?: string, icon?: string) => void;
    onEditList?: (list: TaskList) => void;
    onDeleteList?: (listId: string) => void;
    onUpdateList?: (listId: string, name: string, color: string, icon: string) => void;
}

export function TaskListSidebar({
    lists,
    activeListId,
    onSelectList,
    onCreateList,
    onEditList,
    onDeleteList,
    onUpdateList
}: TaskListSidebarProps) {
    const [showCreateListModal, setShowCreateListModal] = useState(false);
    const [selectedList, setSelectedList] = useState<TaskList | null>(null);
    const [listToEdit, setListToEdit] = useState<TaskList | null>(null);
    const { darkMode } = useTheme();
    const { shareList, updateListPermission, removeListUser } = useTask();

    const handleCreateList = (name: string, color: ListColor, icon: ListIcon) => {
        if (onCreateList) {
            onCreateList(name, color, icon);
        }
    };

    const handleShareList = (list: TaskList) => {
        setSelectedList(list);
    };

    const handleEditList = (list: TaskList) => {
        setListToEdit(list);
    };

    const handleUpdateList = (listId: string, name: string, color: string, icon: string) => {
        if (onUpdateList) {
            onUpdateList(listId, name, color, icon);
        }
    };

    const handleCloseShareModal = () => {
        setSelectedList(null);
    };

    const handleCloseEditModal = () => {
        setListToEdit(null);
    };

    const getListIcon = (list: TaskList) => {
        switch (list.icon) {
            case 'work':
                return <Briefcase className="w-4 h-4 mr-2" />;
            case 'personal':
                return <CheckCircle2 className="w-4 h-4 mr-2" />;
            case 'home':
                return <Home className="w-4 h-4 mr-2" />;
            case 'study':
                return <BookOpen className="w-4 h-4 mr-2" />;
            case 'default':
            default:
                return <Folder className="w-4 h-4 mr-2" />;
        }
    };

    const getListColorClass = (list: TaskList) => {
        switch (list.color) {
            case 'blue':
                return 'text-blue-600 dark:text-blue-400';
            case 'green':
                return 'text-green-600 dark:text-green-400';
            case 'red':
                return 'text-red-600 dark:text-red-400';
            case 'purple':
                return 'text-purple-600 dark:text-purple-400';
            case 'amber':
                return 'text-amber-600 dark:text-amber-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
      <div className="w-full px-3">
        <div className="mb-6 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm py-2.5 h-auto rounded-full
            ${
              activeListId === null
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelectList(null)}
          >
            <CheckCircle2 className="flex-shrink-0 w-5 h-5 mr-3" />
            <span>All Tasks</span>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start text-sm py-2.5 h-auto rounded-full
            ${
              activeListId === 'today'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelectList('today')}
          >
            <Calendar className="flex-shrink-0 w-5 h-5 mr-3" />
            <span>Today</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm py-2.5 h-auto rounded-full
            ${
              activeListId === 'important'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelectList('important')}
          >
            <Star className="flex-shrink-0 w-5 h-5 mr-3" />
            <span>Important</span>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <h2 className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Lists
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowCreateListModal(true)}
            >
              <PlusCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>

          <div className="space-y-1">
            {lists.map(list => (
              <div key={list.id} className="relative group">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm py-2.5 h-auto rounded-full
                  ${
                    activeListId === list.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${getListColorClass(list)}`}
                  onClick={() => onSelectList(list.id)}
                >
                  {getListIcon(list)}
                  <span className="truncate">{list.name}</span>
                  {list.isShared && (
                    <div className="ml-2 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full text-xs text-blue-600 dark:text-blue-400 flex items-center">
                      <Share2 className="h-2.5 w-2.5 mr-0.5" />
                      <span className="truncate">Shared</span>
                    </div>
                  )}
                </Button>

                <div className="absolute transition-opacity -translate-y-1/2 opacity-0 right-2 top-1/2 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          handleShareList(list);
                        }}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share</span>
                      </DropdownMenuItem>

                      {onUpdateList && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-sm cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditList(list);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                      )}

                      {onDeleteList && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-sm text-red-600 cursor-pointer dark:text-red-400"
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteList(list.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          className=" mb-5 w-full justify-start text-sm py-2.5 pl-3 pr-2 h-auto rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          onClick={() => setShowCreateListModal(true)}
        >
          <PlusCircle className="w-5 h-5mr-3" />
          <span>Create new list</span>
        </Button>

        {showCreateListModal && (
          <CreateListModal
            onClose={() => setShowCreateListModal(false)}
            onCreateList={handleCreateList}
          />
        )}

        {selectedList && (
          <ShareListModal
            list={selectedList}
            onClose={handleCloseShareModal}
            onShare={shareList}
            onUpdatePermission={updateListPermission}
            onRemoveUser={removeListUser}
          />
        )}

        {listToEdit && (
          <EditListModal
            list={listToEdit}
            onClose={handleCloseEditModal}
            onUpdateList={handleUpdateList}
          />
        )}
      </div>
    );
}
