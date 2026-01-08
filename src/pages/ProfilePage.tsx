import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passportData: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            passportData: userData.passportData || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        // Fallback to user from context if API fails
        if (user) {
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            passportData: user.passportData || '',
          });
        }
      }
    };

    loadProfile();
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          passportData: formData.passportData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить профиль');
      }

      const updatedUserData = await response.json();
      updateUser({
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        passportData: updatedUserData.passportData || '',
      });
      
      // Update form data to reflect saved values
      setFormData((prev) => ({
        ...prev,
        firstName: updatedUserData.firstName || '',
        lastName: updatedUserData.lastName || '',
        passportData: updatedUserData.passportData || '',
      }));

      setSuccess('Профиль успешно обновлен');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-light py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="card p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">Мой профиль</h1>
            <p className="text-neutral-dark opacity-70">Управление личными данными</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-system-error/20 border border-system-error rounded-lg text-system-error">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-dark mb-2">
                  Имя *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-dark mb-2">
                  Фамилия *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-neutral-light rounded-lg bg-neutral-light/50 text-neutral-dark opacity-70 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-neutral-dark opacity-60">
                Email нельзя изменить
              </p>
            </div>

            <div>
              <label htmlFor="passportData" className="block text-sm font-medium text-neutral-dark mb-2">
                Паспортные данные
              </label>
              <input
                id="passportData"
                name="passportData"
                type="text"
                value={formData.passportData}
                onChange={handleChange}
                placeholder="AB1234567"
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-neutral-dark opacity-60">
                Формат: серия и номер паспорта (например, AB1234567)
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

