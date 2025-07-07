'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Companion } from '@/types';
import apiClient from '@/lib/api';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  User
} from 'lucide-react';

interface CompanionForm {
  firstName: string;
  lastName: string;
}

// NOTE: This page only supports fetching companions for the currently logged-in user via /me endpoint.

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanionForm>();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadCompanions();
  }, [user]);

  const loadCompanions = async () => {
    try {
      setLoading(true);
      const companionsData = await apiClient.getCompanions();
      setCompanions(companionsData);
    } catch (error) {
      toast.error(t('companions.error'));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CompanionForm) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await apiClient.updateCompanion(editingId, data);
        toast.success(t('companions.updateSuccess'));
      } else {
        await apiClient.createCompanion(data);
        toast.success(t('companions.addSuccess'));
      }

      await loadCompanions();
      reset();
      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      toast.error(t('companions.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (companion: Companion) => {
    setEditingId(companion.id);
    reset({
      firstName: companion.firstName,
      lastName: companion.lastName,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this companion?')) {
      try {
        await apiClient.deleteCompanion(id);
        toast.success(t('companions.deleteSuccess'));
        await loadCompanions();
      } catch (error) {
        toast.error(t('companions.error'));
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{t('companions.title')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your companion information
              </p>
            </div>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                {t('companions.add')}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add/Edit Form */}
            {isAdding && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingId ? t('companions.edit') : t('companions.add')}
                  </h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('companions.firstName')} *
                      </label>
                      <input
                        {...register('firstName', { required: t('common.required') })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('companions.lastName')} *
                      </label>
                      <input
                        {...register('lastName', { required: t('common.required') })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        t('common.save')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Companions List */}
            {companions.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No companions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your first companion to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Your Companions</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {companions.map((companion) => (
                    <div key={companion.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              {companion.firstName} {companion.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Added on {new Date(companion.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(companion)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(companion.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 