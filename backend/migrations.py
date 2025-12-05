"""
Simple database migration utilities.
Safely adds missing columns to existing tables.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)


def add_column_if_not_exists(session, table_name: str, column_name: str, column_definition: str) -> bool:
    """
    Add a column to a table if it doesn't exist.

    Args:
        session: SQLAlchemy session
        table_name: Name of the table
        column_name: Name of the column to add
        column_definition: SQL column definition (e.g., "TEXT", "INTEGER NOT NULL DEFAULT 0")

    Returns:
        True if column was added, False if it already existed
    """
    try:
        # Check if column exists (SQLite specific)
        result = session.execute(
            text(f"SELECT COUNT(*) FROM pragma_table_info('{table_name}') WHERE name='{column_name}'")
        )
        exists = result.scalar() > 0

        if exists:
            logger.debug(f"Column {table_name}.{column_name} already exists")
            return False

        # Add the column
        logger.info(f"Adding column {table_name}.{column_name}...")
        session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"))
        session.commit()
        logger.info(f"✓ Added column {table_name}.{column_name}")
        return True

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to add column {table_name}.{column_name}: {e}")
        raise


def run_migrations(session):
    """
    Run all database migrations.
    This function is safe to call multiple times - it only applies changes that haven't been applied yet.
    """
    migrations_applied = 0

    # Migration 1: Add error_message column to meetings table
    if add_column_if_not_exists(session, "meetings", "error_message", "TEXT"):
        migrations_applied += 1

    if migrations_applied > 0:
        logger.info(f"Applied {migrations_applied} database migration(s)")
    else:
        logger.debug("No new migrations to apply")

    return migrations_applied
