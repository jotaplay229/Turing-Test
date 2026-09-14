'use client';
import { siteConfig } from '@/lib/site-config';
import { Logo, SmoothAnchor, Destination, SocialLinks } from './site-links';
export function SiteFooter({ onUnavailable }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <SmoothAnchor href="#inicio" className="footer-brand">
          <Logo inverse />
          <span>
            <strong>Turing Tecnologia</strong>
            <small>© Todos os direitos reservados.</small>
          </span>
        </SmoothAnchor>
        <div className="footer-contact">
          <Destination
            href={`mailto:${siteConfig.contact.email}`}
            onUnavailable={onUnavailable}
            className="footer-email"
          >
            {siteConfig.contact.email}
          </Destination>
          <SocialLinks onUnavailable={onUnavailable} />
        </div>
      </div>
    </footer>
  );
}
