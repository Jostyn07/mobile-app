import LegalDocumentView from '../../components/legal/LegalDocumentView';
import { termsAndConditions } from '../../content/legal/termsAndConditions';

export default function TermsScreen() {
  return <LegalDocumentView doc={termsAndConditions} />;
}