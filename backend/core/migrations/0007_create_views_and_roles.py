# Generated by Django 5.2 on 2025-04-24 20:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_ride_core_ride_source_36a219_gist_and_more"),
    ]

    operations = [
         migrations.RunSQL(
            sql="""
                -- Roles
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'rider_role') THEN
                        CREATE ROLE rider_role;
                    END IF;
                    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'driver_role') THEN
                        CREATE ROLE driver_role;
                    END IF;
                    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_role') THEN
                        CREATE ROLE admin_role;
                    END IF;
                END
                $$;

                -- View 1: Pending Ride Requests
                CREATE OR REPLACE VIEW pending_ride_requests_view AS
                SELECT rr.id as request_id, u.name AS rider_name, rr.source, rr.destination, rr.pooling, rr.created_at
                FROM core_riderequest rr
                JOIN core_rider r ON rr.rider_id = r.id
                JOIN core_user u ON r.user_id = u.id
                WHERE rr.status = 'pending';

                -- View 2: Active Ride Pooling
                CREATE OR REPLACE VIEW active_pooling_summary AS
                SELECT rp.id as pooling_id, d.id, u.name AS driver_name, rp.available_seats, rp.total_seats, rp.status, rp.created_at
                FROM core_ridepooling rp
                JOIN core_driver d ON rp.driver_id = d.id
                JOIN core_user u ON d.user_id = u.id
                WHERE rp.status = 'active';

                -- View 3: Driver Status
                CREATE OR REPLACE VIEW driver_status_board AS
                SELECT d.id, u.name AS driver_name, d.vehicle_model, d.vehicle_number, d.status
                FROM core_driver d
                JOIN core_user u ON d.user_id = u.id;

                -- Grants
                GRANT SELECT, INSERT ON core_riderequest TO rider_role;
                GRANT SELECT ON pending_ride_requests_view TO rider_role;

                GRANT SELECT, UPDATE ON core_driverlocation TO driver_role;
                GRANT SELECT ON driver_status_board TO driver_role;

                GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_role;
                GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_role;
                -- GRANT SELECT ON ALL VIEWS IN SCHEMA public TO admin_role;
            """,
            reverse_sql="""
                DROP VIEW IF EXISTS pending_ride_requests_view;
                DROP VIEW IF EXISTS active_pooling_summary;
                DROP VIEW IF EXISTS driver_status_board;

                REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM rider_role, driver_role, admin_role;
                DROP ROLE IF EXISTS rider_role;
                DROP ROLE IF EXISTS driver_role;
                -- DROP ROLE IF EXISTS admin_role;
            """
        )

    ]
