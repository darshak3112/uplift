import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

export function FooterComponent() {
  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="justify-between w-full sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="/"
            src="/images/Logo.png"
            alt="uplift Logo"
            name="uplift"
          />
          <FooterLinkGroup>
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Licensing</FooterLink>
            <FooterLink href="#landingContactUs">Contact</FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright href="#" by="uplift" year={2021} />
      </div>
    </Footer>
  );
}
