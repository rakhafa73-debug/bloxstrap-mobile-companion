import { RobloxExperience, RobloxConnectionState } from '../types/graphics';

export const POPULAR_EXPERIENCES: RobloxExperience[] = [
  {
    placeId: '2753915549',
    name: 'Blox Fruits',
    category: 'Action / RPG',
    recommendedQuality: 4,
  },
  {
    placeId: '4924922222',
    name: 'Brookhaven RP',
    category: 'Roleplay / Social',
    recommendedQuality: 5,
  },
  {
    placeId: '920587237',
    name: 'Adopt Me!',
    category: 'Simulation',
    recommendedQuality: 5,
  },
  {
    placeId: '6516141723',
    name: 'DOORS',
    category: 'Horror / Atmospheric',
    recommendedQuality: 8,
  },
  {
    placeId: '286090443',
    name: 'Arsenal',
    category: 'Competitive FPS',
    recommendedQuality: 3,
  },
  {
    placeId: '1962086868',
    name: 'Tower of Hell',
    category: 'Obby / Platformer',
    recommendedQuality: 4,
  },
];

export class RobloxDirectBridge {
  /**
   * Directly triggers the Android/iOS Roblox app via official URI Scheme.
   * If on mobile, this will immediately switch the phone into the Roblox app.
   */
  launchApp(): { success: boolean; url: string } {
    const deepLinkUrl = 'roblox://';
    try {
      // Create hidden iframe or location anchor to launch deep link safely
      const anchor = document.createElement('a');
      anchor.href = deepLinkUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      return { success: true, url: deepLinkUrl };
    } catch {
      // Fallback redirect
      window.location.href = deepLinkUrl;
      return { success: true, url: deepLinkUrl };
    }
  }

  /**
   * Launches directly into a specific Roblox Experience by Place ID.
   */
  launchExperience(placeId: string): { success: boolean; url: string } {
    const cleanId = placeId.trim().replace(/\D/g, '') || '2753915549';
    // Official Roblox experience launch scheme
    const deepLinkUrl = `roblox://experiences/start?placeId=${cleanId}`;
    
    try {
      const anchor = document.createElement('a');
      anchor.href = deepLinkUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      return { success: true, url: deepLinkUrl };
    } catch {
      window.location.href = deepLinkUrl;
      return { success: true, url: deepLinkUrl };
    }
  }

  /**
   * Formats a quick copy-paste string of recommendations for player reference
   */
  async copyConfigForRoblox(config: {
    mode: string;
    quality: number;
    priority: string;
  }): Promise<boolean> {
    const text = `[Bloxstrap Companion Quick Guide]\nRoblox Graphics Mode: ${config.mode.toUpperCase()}\nGraphics Quality: Level ${config.quality}/10\nPrioritas: ${config.priority.toUpperCase()}`;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}

export const robloxBridge = new RobloxDirectBridge();
