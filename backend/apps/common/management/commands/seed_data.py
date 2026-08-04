"""
Seeds the database with realistic sample data for local development/demo,
including real downloaded placeholder images (so ImageFields aren't blank).

Usage:
    python manage.py seed_data
    python manage.py seed_data --no-images   # skip image downloads (faster)

Safe to re-run - uses get_or_create keyed on a natural unique-ish field, so
it won't create duplicates on a second run.
"""
import urllib.request
from urllib.error import URLError

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.contact.models import ContactMessage
from apps.gallery.models import GalleryImage
from apps.memberships.models import MembershipPlan
from apps.services.models import Service
from apps.testimonials.models import Testimonial
from apps.trainers.models import Trainer

USER_AGENT = 'Mozilla/5.0 (compatible; IronForgeSeedScript/1.0)'


def download_image(url):
    """Fetch image bytes from a placeholder-image URL. Returns None on any failure
    so seeding still succeeds (with a blank image) if there's no internet access."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read()
    except (URLError, TimeoutError, OSError):
        return None


class Command(BaseCommand):
    help = 'Seed the database with sample services, trainers, plans, testimonials, gallery images, and contact messages.'

    def add_arguments(self, parser):
        parser.add_argument('--no-images', action='store_true', help='Skip downloading placeholder images.')

    def handle(self, *args, **options):
        fetch_images = not options['no_images']
        with transaction.atomic():
            self.seed_services(fetch_images)
            self.seed_trainers(fetch_images)
            self.seed_plans()
            self.seed_testimonials(fetch_images)
            self.seed_gallery(fetch_images)
            self.seed_contact_messages()
        self.stdout.write(self.style.SUCCESS('Done. Sample data seeded.'))

    def attach_image(self, instance, field_name, url, filename):
        image_bytes = download_image(url)
        if image_bytes:
            getattr(instance, field_name).save(filename, ContentFile(image_bytes), save=False)
        else:
            self.stdout.write(self.style.WARNING(f'  Could not download image for {instance}; leaving blank.'))

    # ------------------------------------------------------------------ #
    def seed_services(self, fetch_images):
        self.stdout.write('Seeding services...')
        services = [
            dict(title='Strength Training', icon='dumbbell', seed='strength',
                 description='Barbell-focused programming built around the big compound lifts, scaled from your first squat to competition prep.'),
            dict(title='HIIT & Conditioning', icon='fire', seed='hiit',
                 description='High-intensity interval circuits that build engine and burn fat in 30-45 minute sessions.'),
            dict(title='Cardio Blast', icon='heartbeat', seed='cardio',
                 description='Rower, bike, and treadmill-based conditioning classes with live pace tracking on the big screen.'),
            dict(title='Zumba & Dance Cardio', icon='music', seed='zumba',
                 description='High-energy dance cardio set to Latin and pop playlists - no experience or rhythm required.'),
            dict(title='Yoga & Mobility', icon='lotus', seed='yoga',
                 description='Slow-flow yoga and joint-mobility work to keep you moving well between heavy training days.'),
            dict(title='Personal Coaching', icon='user', seed='coaching',
                 description='1-on-1 programming and in-session coaching tailored to your goals, schedule, and injury history.'),
            dict(title='Nutrition Coaching', icon='apple', seed='nutrition',
                 description='Practical, sustainable nutrition guidance - macros, meal timing, and habit-building, not fad diets.'),
        ]
        for s in services:
            obj, created = Service.objects.get_or_create(
                title=s['title'],
                defaults=dict(description=s['description'], icon=s['icon'], is_active=True),
            )
            if fetch_images and not obj.image:
                self.attach_image(obj, 'image', f"https://picsum.photos/seed/{s['seed']}/800/600", f"{s['seed']}.jpg")
                obj.save()
            self.stdout.write(f'  {"created" if created else "exists"}: {obj.title}')

    def seed_trainers(self, fetch_images):
        self.stdout.write('Seeding trainers...')
        trainers = [
            dict(name='Arjun Mehta', specialization='Strength & Powerlifting', experience='9 yrs experience',
                 certifications='NSCA-CSCS, USA Powerlifting Coach', avatar=12,
                 description='Former competitive powerlifter turned coach, specializing in barbell technique and long-term strength progressions.',
                 email='arjun.mehta@ironforgegym.com', phone='+91 98765 43210',
                 instagram='https://instagram.com/arjun.lifts', facebook='https://facebook.com/arjunmehtacoaching', linkedin=''),
            dict(name='Priya Nair', specialization='Yoga & Mobility', experience='6 yrs experience',
                 certifications='RYT-500, FRC Mobility Specialist', avatar=47,
                 description='Blends traditional yoga with modern mobility science to help lifters move and recover better.',
                 email='priya.nair@ironforgegym.com', phone='+91 98765 43211',
                 instagram='https://instagram.com/priya.flows', facebook='', linkedin=''),
            dict(name='Rahul Verma', specialization='HIIT & Conditioning', experience='7 yrs experience',
                 certifications='ACE-CPT, Precision Nutrition L1', avatar=33,
                 description='Runs our highest-energy conditioning classes and designs progressive fat-loss programs.',
                 email='rahul.verma@ironforgegym.com', phone='+91 98765 43212',
                 instagram='https://instagram.com/rahul.conditioning', facebook='https://facebook.com/rahulvermafit', linkedin=''),
            dict(name='Sneha Kapoor', specialization='Zumba & Dance Cardio', experience='5 yrs experience',
                 certifications='Zumba Licensed Instructor, AFAA Group Fitness', avatar=45,
                 description='Choreographs every dance-cardio class herself and keeps the energy high from warm-up to cool-down.',
                 email='sneha.kapoor@ironforgegym.com', phone='+91 98765 43213',
                 instagram='https://instagram.com/sneha.dances', facebook='', linkedin=''),
            dict(name='Vikram Singh', specialization='Personal Training', experience='11 yrs experience',
                 certifications='NASM-CPT, CSCS, Precision Nutrition L2', avatar=52,
                 description='Our most senior coach - works primarily with 1-on-1 clients on long-term strength and body-composition goals.',
                 email='vikram.singh@ironforgegym.com', phone='+91 98765 43214',
                 instagram='', facebook='', linkedin='https://linkedin.com/in/vikramsinghcoach'),
            dict(name='Ananya Roy', specialization='Nutrition Coaching', experience='4 yrs experience',
                 certifications='Precision Nutrition L1, B.Sc. Nutrition Science', avatar=29,
                 description='Helps members build sustainable eating habits around their training instead of restrictive short-term diets.',
                 email='ananya.roy@ironforgegym.com', phone='+91 98765 43215',
                 instagram='https://instagram.com/ananya.eats', facebook='', linkedin=''),
        ]
        for t in trainers:
            obj, created = Trainer.objects.get_or_create(
                name=t['name'],
                defaults=dict(
                    specialization=t['specialization'], experience=t['experience'],
                    certifications=t['certifications'], description=t['description'],
                    email=t['email'], phone=t['phone'], instagram=t['instagram'],
                    facebook=t['facebook'], linkedin=t['linkedin'], is_active=True,
                ),
            )
            if fetch_images and not obj.image:
                slug = t['name'].lower().replace(' ', '-')
                self.attach_image(obj, 'image', f"https://i.pravatar.cc/400?img={t['avatar']}", f"{slug}.jpg")
                obj.save()
            self.stdout.write(f'  {"created" if created else "exists"}: {obj.name}')

    def seed_plans(self):
        self.stdout.write('Seeding membership plans...')
        plans = [
            dict(plan_name='Basic', duration=MembershipPlan.Duration.MONTHLY, price='29.99', is_popular=False,
                 description='Everything you need to get started.',
                 features=['Full gym floor access', 'Locker room & showers', '1 free fitness assessment', 'Mobile app access']),
            dict(plan_name='Pro', duration=MembershipPlan.Duration.QUARTERLY, price='79.99', is_popular=True,
                 description='Our most popular plan for members training consistently.',
                 features=['Everything in Basic', 'Unlimited group classes', '2 personal training sessions/month', 'Nutrition check-ins', 'Guest passes (2/month)']),
            dict(plan_name='Elite', duration=MembershipPlan.Duration.YEARLY, price='499.99', is_popular=False,
                 description='Full access with dedicated coaching for serious, long-term training.',
                 features=['Everything in Pro', 'Weekly 1-on-1 coaching', 'Custom programming', 'Priority class booking', 'Recovery bay access', 'Free merch pack']),
        ]
        for p in plans:
            obj, created = MembershipPlan.objects.get_or_create(
                plan_name=p['plan_name'],
                defaults=dict(
                    duration=p['duration'], price=p['price'], description=p['description'],
                    features=p['features'], is_popular=p['is_popular'], is_active=True,
                ),
            )
            self.stdout.write(f'  {"created" if created else "exists"}: {obj.plan_name}')

    def seed_testimonials(self, fetch_images):
        self.stdout.write('Seeding testimonials...')
        testimonials = [
            dict(customer_name='Karan Malhotra', rating=5, avatar=8,
                 review="Down 14kg in eight months and I actually enjoy the sessions. The coaches adjust the plan every time something isn't working."),
            dict(customer_name='Ritu Sharma', rating=5, avatar=44,
                 review="Best gym I've trained at in the city. Clean equipment, zero attitude, and the trainers actually watch your form."),
            dict(customer_name='Aditya Kulkarni', rating=4, avatar=15,
                 review="Great strength coaching - hit a 140kg deadlift PR this year with Arjun's programming. Only wish the parking lot was bigger."),
            dict(customer_name='Meera Iyer', rating=5, avatar=36,
                 review="The yoga and mobility classes fixed a shoulder issue I'd been carrying for two years. Priya is fantastic."),
            dict(customer_name='Rohan Das', rating=5, avatar=22,
                 review='Signed up for the free trial week and just never left. A year later, membership has paid for itself many times over.'),
            dict(customer_name='Simran Kaur', rating=4, avatar=41,
                 review="Zumba classes are the best part of my week. Sneha's energy makes it impossible to skip a session."),
        ]
        for t in testimonials:
            obj, created = Testimonial.objects.get_or_create(
                customer_name=t['customer_name'],
                defaults=dict(rating=t['rating'], review=t['review'], is_active=True),
            )
            if fetch_images and not obj.image:
                slug = t['customer_name'].lower().replace(' ', '-')
                self.attach_image(obj, 'image', f"https://i.pravatar.cc/300?img={t['avatar']}", f"{slug}.jpg")
                obj.save()
            self.stdout.write(f'  {"created" if created else "exists"}: {obj.customer_name}')

    def seed_gallery(self, fetch_images):
        self.stdout.write('Seeding gallery...')
        images = [
            dict(title='Main Gym Floor', category=GalleryImage.Category.FLOOR, seed='floor-1'),
            dict(title='Free Weight Section', category=GalleryImage.Category.FLOOR, seed='floor-2'),
            dict(title='HIIT Class in Session', category=GalleryImage.Category.CLASSES, seed='class-1'),
            dict(title='Yoga Studio', category=GalleryImage.Category.CLASSES, seed='class-2'),
            dict(title='Squat Rack Row', category=GalleryImage.Category.EQUIPMENT, seed='equip-1'),
            dict(title='Cardio Deck', category=GalleryImage.Category.EQUIPMENT, seed='equip-2'),
            dict(title='Annual Member Meetup', category=GalleryImage.Category.EVENTS, seed='event-1'),
            dict(title='Locker Rooms', category=GalleryImage.Category.FACILITY, seed='facility-1'),
        ]
        if not fetch_images:
            self.stdout.write('  Skipping gallery (needs an image; nothing to create with --no-images).')
            return
        for g in images:
            if GalleryImage.objects.filter(title=g['title']).exists():
                self.stdout.write(f'  exists: {g["title"]}')
                continue
            obj = GalleryImage(title=g['title'], category=g['category'])
            self.attach_image(obj, 'image', f"https://picsum.photos/seed/{g['seed']}/900/700", f"{g['seed']}.jpg")
            if obj.image:
                obj.save()
                self.stdout.write(f'  created: {obj.title}')
            else:
                self.stdout.write(self.style.WARNING(f'  skipped {g["title"]} (no image downloaded)'))

    def seed_contact_messages(self):
        self.stdout.write('Seeding contact messages...')
        messages = [
            dict(name='Farah Sheikh', email='farah.sheikh@example.com', phone='+91 91234 56780',
                 subject='Membership Plans', message="Hi, I'm looking to switch from Basic to Pro - what's the process and is there a fee?",
                 is_read=False),
            dict(name='Devraj Patil', email='devraj.patil@example.com', phone='',
                 subject='General Inquiry', message='Do you offer a free trial day before committing to a plan?',
                 is_read=True),
            dict(name='Isha Bansal', email='isha.bansal@example.com', phone='+91 99887 76655',
                 subject='Personal Training', message="Interested in 1-on-1 sessions with Vikram. What's his availability like this month?",
                 is_read=False),
        ]
        for m in messages:
            obj, created = ContactMessage.objects.get_or_create(
                email=m['email'], subject=m['subject'],
                defaults=dict(name=m['name'], phone=m['phone'], message=m['message'], is_read=m['is_read']),
            )
            self.stdout.write(f'  {"created" if created else "exists"}: {obj.name}')
