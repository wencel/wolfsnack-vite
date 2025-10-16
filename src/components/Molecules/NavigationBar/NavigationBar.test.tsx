import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { testRender } from '@/test/test-utils';
import NavigationBar from './';

describe('NavigationBar', () => {
  it('renders with default props', () => {
    testRender(<NavigationBar />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toHaveClass('_NavigationBar_b2e065');
  });

  it('renders children correctly', () => {
    const testContent = 'Navigation Content';
    testRender(
      <NavigationBar>
        <div>{testContent}</div>
      </NavigationBar>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(screen.getByText(testContent)).toBeVisible();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-nav-bar';
    testRender(<NavigationBar className={customClass} />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toHaveClass('_NavigationBar_b2e065');
    expect(navElement).toHaveClass(customClass);
  });

  it('renders multiple children correctly', () => {
    testRender(
      <NavigationBar>
        <div>First Item</div>
        <div>Second Item</div>
        <div>Third Item</div>
      </NavigationBar>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();

    expect(screen.getByText('First Item')).toBeVisible();
    expect(screen.getByText('Second Item')).toBeVisible();
    expect(screen.getByText('Third Item')).toBeVisible();
  });

  it('renders complex nested children', () => {
    testRender(
      <NavigationBar>
        <div>
          <h1>Main Title</h1>
          <ul>
            <li>List Item 1</li>
            <li>List Item 2</li>
          </ul>
        </div>
        <button type="button">Action Button</button>
      </NavigationBar>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Main Title' })
    ).toBeVisible();
    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeVisible();
  });

  it('renders without children', () => {
    testRender(<NavigationBar />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toBeEmptyDOMElement();
  });

  it('handles empty children gracefully', () => {
    testRender(<NavigationBar>{null}</NavigationBar>);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toBeEmptyDOMElement();
  });

  it('maintains proper semantic structure', () => {
    testRender(
      <NavigationBar>
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </NavigationBar>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/home'
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('works with different types of content', () => {
    testRender(
      <NavigationBar>
        <span>Text Content</span>
        <input type="text" placeholder="Search" />
        <select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </NavigationBar>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();

    expect(screen.getByText('Text Content')).toBeVisible();
    expect(screen.getByRole('textbox', { name: '' })).toBeVisible();
    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('applies multiple custom classes correctly', () => {
    const customClasses = 'custom-class another-class';
    testRender(<NavigationBar className={customClasses} />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toHaveClass('_NavigationBar_b2e065');
    expect(navElement).toHaveClass('custom-class');
    expect(navElement).toHaveClass('another-class');
  });

  it('handles undefined className gracefully', () => {
    testRender(<NavigationBar className={undefined} />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeVisible();
    expect(navElement).toHaveClass('_NavigationBar_b2e065');
    // Should not have any undefined classes
    expect(navElement.className).not.toContain('undefined');
  });
});
