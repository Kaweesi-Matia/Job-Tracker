import { useState, useEffect } from 'react';
import { Plus, Briefcase, Filter } from 'lucide-react';
import { supabase, Job } from './lib/supabase';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
      } else {
        return a.company.localeCompare(b.company);
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, filterStatus, sortBy]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('application_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: Partial<Job>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      setJobs([data, ...jobs]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleUpdateJob = async (jobData: Partial<Job>) => {
    if (!editingJob) return;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', editingJob.id)
        .select()
        .single();

      if (error) throw error;
      setJobs(jobs.map(job => job.id === data.id ? data : job));
      setEditingJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
  };

  const stats = {
    total: jobs.length,
    wishlist: jobs.filter(j => j.status === 'Wishlist').length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    offer: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Briefcase className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Job Tracker</h1>
                <p className="text-gray-600">Manage your job applications in one place</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={20} />
              Add Job
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-400">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-400">
              <p className="text-gray-600 text-sm">Wishlist</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wishlist}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400">
              <p className="text-gray-600 text-sm">Applied</p>
              <p className="text-2xl font-bold text-blue-900">{stats.applied}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
              <p className="text-gray-600 text-sm">Interview</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.interview}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-400">
              <p className="text-gray-600 text-sm">Offers</p>
              <p className="text-2xl font-bold text-green-900">{stats.offer}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-400">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'company')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus !== 'all' ? 'No jobs found with this status' : 'No jobs yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus !== 'all'
                ? 'Try selecting a different filter'
                : 'Start tracking your job applications by adding your first job'}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}

        {(showForm || editingJob) && (
          <JobForm
            job={editingJob}
            onSubmit={editingJob ? handleUpdateJob : handleAddJob}
            onCancel={() => {
              setShowForm(false);
              setEditingJob(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
