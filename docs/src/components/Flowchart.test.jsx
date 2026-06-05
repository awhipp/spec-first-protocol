import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Flowchart from './Flowchart';

describe('Flowchart', () => {
  it('renders all flowchart steps', () => {
    render(<Flowchart />);
    expect(screen.getAllByText('discover').length).toBeGreaterThan(0);
    expect(screen.getAllByText('audit').length).toBeGreaterThan(0);
    expect(screen.getAllByText('refine').length).toBeGreaterThan(0);
    expect(screen.getAllByText('lock').length).toBeGreaterThan(0);
  });

  it('updates details card when step is clicked', () => {
    render(<Flowchart />);
    
    // Initial state should be discover
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    
    // Click on audit
    const auditBtn = screen.getByText('audit').closest('button');
    fireEvent.click(auditBtn);
    
    // Should update to audit details
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText(/Passes \(clean status\) only when zero blockers/)).toBeInTheDocument();
  });
});
