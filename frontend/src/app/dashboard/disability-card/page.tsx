'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DisabilityCard } from '@/types';
import apiClient from '@/lib/api';
import { 
  FileText, 
  Upload, 
  Edit, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface DisabilityCardForm {
  number: string;
  expiry: string;
  issueDate: string;
  proof: FileList;
}

// NOTE: This page only supports fetching the disability card for the currently logged-in user via /me endpoint.

export default function DisabilityCardPage() {
  const [disabilityCard, setDisabilityCard] = useState<DisabilityCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DisabilityCardForm>();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadDisabilityCard();
  }, [user]);

  const loadDisabilityCard = async () => {
    try {
      setLoading(true);
      
      const card = await apiClient.getDisabilityCard();
      console.log('Disability card API response:', card);

      // If no disability card exists, set to null (empty state) - this is normal
      if (!card) {
        console.log('No disability card found for user');
        setDisabilityCard(null);
        return;
      }

      console.log('Disability card found:', card);
      setDisabilityCard(card);
      if (card && card.expiry) {
        reset({
          number: card.number,
          expiry: card.expiry.split('T')[0],
          issueDate: card.issueDate.split('T')[0],
        });
      }
    } catch (error) {
      console.error('Failed to load disability card:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DisabilityCardForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('data[number]', data.number);
      formData.append('data[expiry]', data.expiry);
      formData.append('data[issueDate]', data.issueDate);
      formData.append('data[reviewStatus]', 'unreviewed');
      
      if (data.proof && data.proof[0]) {
        formData.append('files.proof', data.proof[0]);
      }

      if (disabilityCard) {
        await apiClient.updateDisabilityCard(disabilityCard.id, formData);
        toast.success(t('disabilityCard.uploadSuccess'));
      } else {
        await apiClient.createDisabilityCard(formData);
        toast.success(t('disabilityCard.uploadSuccess'));
      }

      await loadDisabilityCard();
      setIsEditing(false);
    } catch (error) {
      toast.error(t('disabilityCard.uploadError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'expired':
        return 'Expired';
      default:
        return 'Under Review';
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">{t('disabilityCard.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your disability card information
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : disabilityCard ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {t('disabilityCard.title')}
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(disabilityCard.reviewStatus)}
                  <span className="text-sm font-medium text-gray-700">
                    {getStatusText(disabilityCard.reviewStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.number')}
                  </label>
                  <p className="text-sm text-gray-900">{disabilityCard.number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.status')}
                  </label>
                  <div className="flex items-center">
                    {getStatusIcon(disabilityCard.reviewStatus)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getStatusText(disabilityCard.reviewStatus)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.issueDate')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(disabilityCard.issueDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.expiry')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(disabilityCard.expiry).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {disabilityCard.proof && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.proof')}
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                                         <img
                       src={`http://localhost:1337${disabilityCard.proof.url}`}
                       alt="Disability card proof"
                       className="max-w-full h-auto max-h-64 object-contain"
                     />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Edit className="h-4 w-4 mr-2 inline" />
                  {t('common.edit')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t('disabilityCard.noCard')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload your disability card to get started.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  {t('disabilityCard.upload')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {disabilityCard ? t('disabilityCard.update') : t('disabilityCard.upload')}
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.number')} *
                  </label>
                  <input
                    {...register('number', { required: t('common.required') })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter card number"
                  />
                  {errors.number && (
                    <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.issueDate')} *
                  </label>
                  <input
                    {...register('issueDate', { required: t('common.required') })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.issueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.expiry')} *
                  </label>
                  <input
                    {...register('expiry', { required: t('common.required') })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('disabilityCard.proof')} *
                  </label>
                  <input
                    {...register('proof', { required: !disabilityCard ? t('common.required') : false })}
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.proof && (
                    <p className="mt-1 text-sm text-red-600">{errors.proof.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Upload an image or PDF of your disability card
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
      </div>
    </div>
  );
} 