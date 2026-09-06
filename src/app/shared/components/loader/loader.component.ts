import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-backdrop">
      <div class="spinner-card glass-card">
        <div class="spinner"></div>
        <p class="loader-text">Analizando el repositorio...</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .spinner-card {
      padding: 32px 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--border-accent);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(56, 189, 248, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loader-text {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-main);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent { }
