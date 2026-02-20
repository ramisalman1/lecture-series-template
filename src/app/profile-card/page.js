import ProfileCard from '../../components/ProfileCard';

export const metadata = {
  title: 'بطاقة التعارف — ألف باء الزواج',
  description: 'بطاقة تعريف بالنفس للتعارف قبل الزواج — مستوحاة من المجلس الخامس والرابع عشر',
};

export default function ProfileCardPage() {
  return (
    <main className="main main--home">
      <div className="profile-card-page">
        <div className="profile-card-page__header">
          <span className="material-icons-round profile-card-page__icon">badge</span>
          <h1 className="profile-card-page__title">بطاقة التعارف</h1>
          <p className="profile-card-page__desc">ورقة تعريف بالنفس للتعارف قبل الزواج</p>
        </div>
        <ProfileCard />
      </div>
    </main>
  );
}
