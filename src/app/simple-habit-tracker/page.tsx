'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { UnifiedBreadcrumbs } from '@/components/layout/unified-breadcrumbs';

export default function SimpleHabitTrackerPage() {
  return (
    <div className={styles.pageRoot} style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      lineHeight: 1.6,
      fontSize: '16px'
    }}>

      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>The Simplest Habit Tracker Online – Zero Friction, 100% Focus</h1>
          <p className={styles.subtitle}>Tired of habit apps that feel like a second job? Welcome to the most minimal habit tracker ever built. No setup fatigue. No notification spam. Just pure habit building.</p>
          <Link href="/free-habit-tracker" className={styles.ctaButton}>Start Tracking Instantly →</Link>
        </header>

        <section>
          <h2 className={styles.h2}>Why Simplicity Wins for Habit Building</h2>

          <h3 className={styles.h3}>Complex Tools Are Working Against You</h3>
          <p className={styles.p}>Every "feature-rich" habit app promises to help, but they often create more problems than they solve:</p>

          <div className={styles.highlightBox}>
            <strong>Setup Fatigue:</strong> Spending 20 minutes configuring categories, colors, and reminders before tracking a single habit
          </div>

          <div className={styles.highlightBox}>
            <strong>Notification Overload:</strong> Your phone buzzing about meditation while you're trying to meditate
          </div>

          <div className={styles.highlightBox}>
            <strong>Feature Bloat:</strong> Gamification, social sharing, and achievement systems that distract from the actual habit
          </div>

          <h3 className={styles.h3}>The Science: Cognitive Load Reduces Consistency</h3>
          <p className={styles.p}>Research shows that every decision point decreases your likelihood of following through. When building habits, your brain needs <strong>fewer</strong> decisions, not more.</p>

          <p className={styles.p}>Each extra click, setting, or notification adds friction. And friction kills momentum.</p>
        </section>

        <section>
          <h2 className={styles.h2}>What Makes Our Tracker Truly Simple</h2>

          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <h3 className={styles.h3}>✓ No Signup, No Email, No Password</h3>
              <p className={styles.p}>Just open and start tracking. Your data stays in your browser. No accounts to manage, no passwords to forget.</p>
            </div>

            <div className={styles.featureItem}>
              <h3 className={styles.h3}>✓ One-Click Habit Creation</h3>
              <p className={styles.p}>Type your habit name. Hit enter. Done. No categories, colors, icons, or complexity.</p>
            </div>

            <div className={styles.featureItem}>
              <h3 className={styles.h3}>✓ Clean Grid View</h3>
              <p className={styles.p}>Visual streaks that actually motivate. See your progress at a glance with our minimalist habit grid.</p>
            </div>

            <div className={styles.featureItem}>
              <h3 className={styles.h3}>✓ Works Instantly in Browser</h3>
              <p className={styles.p}>No download. No installation. No updates. Open the page and start building habits immediately.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className={styles.h2}>Less Setup, More Doing</h2>

          <p className={styles.p}>While other apps want to be your "habit operating system," we just want you to build habits. Here's how we compare:</p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Complex Apps</th>
                <th>Our Simple Tracker</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Setup Time</td>
                <td className={styles.xIcon}>10-30 minutes</td>
                <td className={styles.checkIcon}>30 seconds</td>
              </tr>
              <tr>
                <td>Account Required</td>
                <td className={styles.xIcon}>✗ Yes</td>
                <td className={styles.checkIcon}>✓ No</td>
              </tr>
              <tr>
                <td>Notifications</td>
                <td className={styles.xIcon}>✗ Spam</td>
                <td className={styles.checkIcon}>✓ None</td>
              </tr>
              <tr>
                <td>Learning Curve</td>
                <td className={styles.xIcon}>✗ Steep</td>
                <td className={styles.checkIcon}>✓ Zero</td>
              </tr>
              <tr>
                <td>Focus on Habits</td>
                <td className={styles.xIcon}>✗ Features first</td>
                <td className={styles.checkIcon}>✓ Habits first</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className={styles.h2}>Built for People Who've Tried Everything</h2>

          <p className={styles.p}>If you've bounced between Habitica's gamification, Streaks' complexity, and Notion templates that require a PhD to set up — you're not alone.</p>

          <div className={styles.highlightBox}>
            <strong>We built this for you.</strong> The person who's tired of productivity theater and just wants to build habits without the hassle.
          </div>

          <p className={styles.p}><strong>Simplicity is backed by <Link href="/how-to-build-a-habit" className={styles.link}>habit science</Link>:</strong> The less friction between you and your habit, the more likely you are to stick with it long-term.</p>
        </section>

        <section style={{ textAlign: 'center', margin: '3rem 0' }}>
          <h2 className={styles.h2}>Ready to Experience True Simplicity?</h2>
          <p className={styles.p}>Join thousands who've ditched complex apps for something that actually works.</p>
          <Link href="/free-habit-tracker" className={styles.ctaButton}>Try The Simplest Habit Tracker →</Link>
          <p className={styles.smallMuted}>Free forever • No signup required • Works instantly</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.p}>Made for people who just want to build habits, not manage apps.</p>
        <p className={styles.p}><Link href="/simple-habit-tracker" className={styles.link}>The simplest habit tracker online</Link> — because complexity is the enemy of consistency.</p>
      </footer>
    </div>
  );
}