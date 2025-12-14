describe('Тестирование конструктора бургера и заказа', () => {
  // JSON
  const BUN_NAME = 'Краторная булка N-200i';
  const FILLING_NAME_1 = 'Мясо бессмертных моллюсков Protostomia';
  const FILLING_NAME_2 = 'Соус традиционный галактический';
  const MODAL_TITLE = 'Детали ингредиента';
  const CONSTRUCTOR_TEXT_FOR_DROP = 'Выберите булки';
  const CONSTRUCTOR_INGREDIENT_CLASS = '.constructor-element';

  // РАБОЧИЕ СЕЛЕКТОРЫ (Работают!)
  const MODAL_CLASS = '.xqsNTMuGR8DdWtMkOGiM';
  const CLOSE_BUTTON_CLASS = '.Z7mUFPBZScxutAKTLKHN';
  const ORDER_BUTTON_SELECTOR = '.button_type_primary.button_size_large';
  const ADD_BUTTON_CLASS = '.common_button';
  const MODALS_CONTAINER_ID = '#modals';

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    // ждём пока булочка станет видимой
    cy.contains(BUN_NAME, { timeout: 10000 }).should('be.visible');
  });

  // ТЕСТИРОВАНИЕ КОНСТРУКТОРА
  it('должен добавить булку и начинку в конструктор через клик', () => {
    // Добавляем булку
    cy.contains(BUN_NAME).parents('li').find(ADD_BUTTON_CLASS).click();

    // Добавление первой начинки
    cy.contains(FILLING_NAME_1).parents('li').find(ADD_BUTTON_CLASS).click();

    // Добавление сосуса
    cy.contains(FILLING_NAME_2).parents('li').find(ADD_BUTTON_CLASS).click();

    // проверка на содержание двух начинок
    cy.contains('Соберите бургер')
      .parents('div')
      .find(CONSTRUCTOR_INGREDIENT_CLASS)
      .should('have.length.at.least', 4);
  });

  // ТЕСТИРОВАНИЕ МОДАЛЬНЫХ ОКОН (Работают!)

  it('должен открыть модальное окно ингредиента при клике', () => {
    cy.contains(BUN_NAME).click();
    cy.get(MODAL_CLASS).should('be.visible');
    cy.contains(MODAL_TITLE).should('be.visible');
  });

  it('должен закрыть модальное окно по клику на крестик', () => {
    cy.contains(BUN_NAME).click();
    cy.get(CLOSE_BUTTON_CLASS).should('be.visible').click();
    cy.get(MODAL_CLASS).should('not.exist');
  });

  // Закрытие нажатием кнопки escape
  it('должен закрыть модальное окно по нажатию ESC', () => {
    cy.contains(BUN_NAME).click();
    cy.get(MODAL_CLASS).should('be.visible');

    cy.get('body').type('{esc}');

    cy.get(MODAL_CLASS).should('not.exist');
  });

  // ТЕСТИРОВАНИЕ СОЗДАНИЯ ЗАКАЗА
  it('должен оформить заказ, показать номер и очистить конструктор', () => {
    // Авторизация
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.setCookie('refreshToken', 'test-refreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains(BUN_NAME, { timeout: 10000 }).should('be.visible');

    // Сборка бьургера(имена из JSON)
    cy.log('Добавляем булку и начинку для заказа кликами');

    // Добавляем булку
    cy.contains(BUN_NAME).parents('li').find(ADD_BUTTON_CLASS).click();

    // Добавляем начинку
    cy.contains(FILLING_NAME_1).parents('li').find(ADD_BUTTON_CLASS).click();

    // ОФОРМЛЯЕМ и ПРОВЕРЯЕМ
    cy.get(ORDER_BUTTON_SELECTOR).should('not.be.disabled').click();
    cy.wait('@createOrder');

    // Проверка заказа
    cy.get(MODAL_CLASS).should('be.visible');
    cy.contains('12345').should('be.visible');

    // ЗАкрытие модал после оформления заказа
    cy.get(CLOSE_BUTTON_CLASS).click();
    cy.get(MODAL_CLASS).should('not.exist');

    // проверка пустогого консртуктора
    cy.contains(CONSTRUCTOR_TEXT_FOR_DROP).should('be.visible');
  });
});
