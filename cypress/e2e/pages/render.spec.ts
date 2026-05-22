import { beforeEach, cy, describe, it } from 'local-cypress';

describe('All Page', () => {
  beforeEach(() => {
    cy.window().then((win) =>
      win.localStorage.setItem('umami.disabled', 'true'),
    );
  });

  it('should display index page', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'BJUT').and('contain', 'SWIFT');
    cy.contains('a', '留言簿').should('be.visible');
  });

  it('should display blog page', () => {
    cy.visit('/blog');
    cy.contains('h1', '专栏分享').should('be.visible');
    cy.get('input[placeholder="搜索..."]').should('be.visible');
  });

  it('should display feiyue page', () => {
    cy.visit('/feiyue');
    cy.contains('h1', '北京工业大学飞跃手册').should('be.visible');
    cy.get('input[placeholder="搜索申请人、专业、方向..."]').should('be.visible');
  });

  it('should display projects page', () => {
    cy.visit('/projects');
    cy.contains('h1', '已有项目').should('be.visible');
    cy.contains('p', '正在发展中，欢迎任何同学参与建设。').should('be.visible');
  });

  it('should display shorts page', () => {
    cy.visit('/shorts');
    cy.contains('h1', '教程').should('be.visible');
    cy.get('input[placeholder="Search..."]').should('be.visible');
  });

  it('should display guestbook page', () => {
    cy.visit('/guestbook');
    cy.contains('h1', '留言簿').should('be.visible');
    cy.contains('a', 'GitHub Discussions').should('be.visible');
  });
});
