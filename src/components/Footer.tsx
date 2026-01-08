import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">О нас</h3>
            <p className="text-primary-200">
              Система продажи железнодорожных билетов онлайн. Быстро, удобно, надежно.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Контакты</h3>
            <p className="text-primary-200">Телефон: +375 (17) 123-45-67</p>
            <p className="text-primary-200">Email: support@railway.by</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Правила</h3>
            <ul className="space-y-2 text-primary-200">
              <li>
                <a href="#" className="hover:text-primary-300 transition">
                  Правила перевозки
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-300 transition">
                  Возврат билетов
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-300 transition">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-200">
          <p>&copy; 2024 ЖД Вокзал Минск. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

