describe('Тестирование конструктора бургера и заказа', () => {
  // json
  const BUN_NAME = 'Краторная булка N-200i';
  const FILLING_NAME_1 = 'Мясо бессмертных моллюсков Protostomia';
  const FILLING_NAME_2 = 'Соус традиционный галактический';
  const MODAL_TITLE = 'Детали ингредиента';
  const CONSTRUCTOR_TEXT_FOR_DROP = 'Выберите булки';
  const CONSTRUCTOR_INGREDIENT_CLASS = '.constructor-element';

  // СЕЛЕКТОРЫ UI
  const CONSTRUCTOR_AREA_CLASS = '.oRJKB4wIRrzdy80OQfg6';
  const MODAL_CLASS = '.xqsNTMuGR8DdWtMkOGiM';
  const CLOSE_BUTTON_CLASS = '.Z7mUFPBZScxutAKTLKHN';
  const ORDER_BUTTON_SELECTOR = '.button_type_primary.button_size_large';
  const ADD_BUTTON_CLASS = '.common_button';

  // Функция для получения контейнера конструктора
  const getConstructorArea = () => cy.get(CONSTRUCTOR_AREA_CLASS);

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains(BUN_NAME, { timeout: 10000 }).should('be.visible');
  });

  // ТЕСТИРОВАНИЕ КОНСТРУКТОРА
  it('должен добавить булку и начинку в конструктор через клик и проверить содержимое', () => {
    // Добавляем ингредиенты
    cy.contains(BUN_NAME).parents('li').find(ADD_BUTTON_CLASS).click();
    cy.contains(FILLING_NAME_1).parents('li').find(ADD_BUTTON_CLASS).click();
    cy.contains(FILLING_NAME_2).parents('li').find(ADD_BUTTON_CLASS).click();

    // Проверка количества элементов
    getConstructorArea()
      .find(CONSTRUCTOR_INGREDIENT_CLASS)
      .should('have.length.at.least', 4);

    // ПРОВЕРКА СОДЕРЖИМОГО
    getConstructorArea().should('contain', BUN_NAME);
    getConstructorArea().should('contain', FILLING_NAME_1);
    getConstructorArea().should('contain', FILLING_NAME_2);
  });

  // ТЕСТИРОВАНИЕ МОДАЛЬНЫХ ОКОН (РАБОТАЕТ)
  it('должен открыть модальное окно ингредиента при клике и проверить детали', () => {
    cy.contains(BUN_NAME).click();
    cy.get(MODAL_CLASS).should('be.visible');

    cy.contains(MODAL_TITLE).should('be.visible');
    cy.contains(BUN_NAME).should('be.visible');

    cy.contains('80').should('be.visible');
    cy.contains('24').should('be.visible');
    cy.contains('53').should('be.visible');
    cy.contains('420').should('be.visible');
  });

  it('должен закрыть модальное окно по клику на крестик', () => {
    cy.contains(BUN_NAME).click();
    cy.get(CLOSE_BUTTON_CLASS).should('be.visible').click();
    cy.get(MODAL_CLASS).should('not.exist');
  });

  it('должен закрыть модальное окно по нажатию ESC', () => {
    cy.contains(BUN_NAME).click();
    cy.get(MODAL_CLASS).should('be.visible');

    cy.get('body').type('{esc}');

    cy.get(MODAL_CLASS).should('not.exist');
  });

  // ТЕСТИРОВАНИЕ СОЗДАНИЯ ЗАКАЗА (РАБОТАЕТ)
  it('должен оформить заказ, показать номер и очистить конструктор', () => {
    // ...
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.setCookie('refreshToken', 'test-refreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains(BUN_NAME, { timeout: 10000 }).should('be.visible');

    cy.log('Добавляем булку и начинку для заказа кликами');
    cy.contains(BUN_NAME).parents('li').find(ADD_BUTTON_CLASS).click();
    cy.contains(FILLING_NAME_1).parents('li').find(ADD_BUTTON_CLASS).click();

    cy.get(ORDER_BUTTON_SELECTOR).should('not.be.disabled').click();
    cy.wait('@createOrder');

    cy.get(MODAL_CLASS).should('be.visible');
    cy.contains('12345').should('be.visible');

    cy.get(CLOSE_BUTTON_CLASS).click();
    cy.get(MODAL_CLASS).should('not.exist');

    cy.contains(CONSTRUCTOR_TEXT_FOR_DROP).should('be.visible');
  });
});
