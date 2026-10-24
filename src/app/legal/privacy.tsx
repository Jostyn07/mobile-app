import LegalDocumentView from '../../components/legal/LegalDocumentView';
import { privacyNotice } from '../../content/legal/privacyNotice';

export default function PrivacyScreen() {
  return <LegalDocumentView doc={privacyNotice} />;
}