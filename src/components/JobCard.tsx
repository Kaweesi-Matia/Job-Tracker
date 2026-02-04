import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, Trash2, Edit } from 'lucide-react';
import { Job } from '../lib/supabase';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  Wishlist: 'bg-gray-100 text-gray-800 border-gray-300',
  Applied: 'bg-blue-100 text-blue-800 border-blue-300',
  Interview: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Offer: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
};

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.position}</h3>
          <p className="text-lg text-gray-700 flex items-center gap-2">
            <Briefcase size={18} />
            {job.company}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {job.location && (
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin size={16} />
            {job.location}
          </p>
        )}
        {job.salary_range && (
          <p className="text-gray-600 flex items-center gap-2">
            <DollarSign size={16} />
            {job.salary_range}
          </p>
        )}
        <p className="text-gray-600 flex items-center gap-2">
          <Calendar size={16} />
          Applied: {new Date(job.application_date).toLocaleDateString()}
        </p>
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
          >
            <ExternalLink size={16} />
            View Job Posting
          </a>
        )}
      </div>

      {job.notes && (
        <p className="text-gray-600 text-sm mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          {job.notes}
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
