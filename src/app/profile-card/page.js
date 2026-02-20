import ProfileCard from '../../components/ProfileCard';

export const metadata = {
  title: 'بطاقة التعارف — ألف باء الزواج',
  description: 'بطاقة تعريف بالنفس للتعارف قبل الزواج — مستوحاة من المجلس الخامس والرابع عشر',
};

export default function ProfileCardPage() {
  return (
    <main className="main main--home">
      <div className="profile-card-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">badge</span>
          </div>
          <h1 className="section-header__title">بطاقة التعارف</h1>
          <p className="section-header__desc">ورقة تعريف بالنفس للتعارف قبل الزواج</p>
        </div>
        <ProfileCard />
      </div>
    </main>
  );
}
