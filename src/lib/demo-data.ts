export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lessonsCount: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  videoUrl?: string;
  videoId?: string;
  videoType?: 'bunny' | 'youtube';
  notes?: string;
  attachments?: Attachment[];
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  targetRole?: 'all' | 'student' | 'admin';
  isRead?: boolean;
  createdAt?: string;
}


