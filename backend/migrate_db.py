"""
Database migration script to add missing columns to existing tables.
Run this script to update your database schema without losing data.
"""
import logging
import sys
from pathlib import Path

# Handle import paths
sys.path.insert(0, str(Path(__file__).parent))

try:
    from backend.database import init_engine, get_session
    from backend.config import DefaultConfig
except ModuleNotFoundError:
    from database import init_engine, get_session
    from config import DefaultConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def add_column_if_not_exists(table_name: str, column_name: str, column_definition: str):
    """Add a column to a table if it doesn't exist."""
    session = get_session()
    try:
        # Check if column exists by querying table info
        result = session.execute(
            f"SELECT COUNT(*) FROM pragma_table_info('{table_name}') WHERE name='{column_name}'"
        )
        exists = result.scalar() > 0

        if exists:
            logger.info(f"Column {table_name}.{column_name} already exists, skipping")
            return False

        # Add the column
        logger.info(f"Adding column {table_name}.{column_name}...")
        session.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}")
        session.commit()
        logger.info(f"✓ Successfully added {table_name}.{column_name}")
        return True

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to add column {table_name}.{column_name}: {e}")
        raise
    finally:
        session.close()


def migrate():
    """Run all database migrations."""
    logger.info("=" * 60)
    logger.info("Starting database migration...")
    logger.info("=" * 60)

    # Initialize database engine
    config = DefaultConfig()
    init_engine(config.SQLALCHEMY_DATABASE_URI)
    logger.info(f"Connected to database: {config.SQLALCHEMY_DATABASE_URI}")

    # Add missing columns
    migrations_applied = 0

    # Migration 1: Add error_message column to meetings table
    if add_column_if_not_exists("meetings", "error_message", "TEXT"):
        migrations_applied += 1

    logger.info("=" * 60)
    logger.info(f"Migration complete! {migrations_applied} changes applied.")
    logger.info("=" * 60)


if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        logger.exception("Migration failed!")
        sys.exit(1)
